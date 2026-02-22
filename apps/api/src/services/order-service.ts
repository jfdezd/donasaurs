import type pg from "pg";
import type { Order, ReserveListingInput } from "@donasaurs/domain";
import { OrderStatus } from "@donasaurs/domain";
import { ListingRepository } from "../repositories/listing-repository.js";
import { OrderRepository } from "../repositories/order-repository.js";
import { UserRepository } from "../repositories/user-repository.js";

/** Valid state transitions for orders */
const VALID_TRANSITIONS: Record<string, string> = {
  CREATED: "AWAITING_ESCROW",
  AWAITING_ESCROW: "ESCROW_CONFIRMED",
  ESCROW_CONFIRMED: "SHIPPED",
  SHIPPED: "DELIVERED",
  DELIVERED: "COMPLETED",
};

export class OrderService {
  private listingRepo: ListingRepository;
  private orderRepo: OrderRepository;
  private userRepo: UserRepository;

  constructor(private pool: pg.Pool) {
    this.listingRepo = new ListingRepository(pool);
    this.orderRepo = new OrderRepository(pool);
    this.userRepo = new UserRepository(pool);
  }

  /**
   * Reserve a listing and create an order inside a single transaction.
   * Uses UPDATE ... WHERE status = 'ACTIVE' RETURNING id to prevent double-reserve.
   */
  async reserveListing(
    buyerId: string,
    email: string,
    input: ReserveListingInput,
  ): Promise<Order> {
    await this.userRepo.ensureUser(buyerId, email);

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      // Atomic reserve — fails if listing is not ACTIVE
      const reserved = await this.listingRepo.reserveAtomically(
        input.listing_id,
        buyerId,
        client,
      );

      if (!reserved) {
        throw new ServiceError(409, "Listing is not available for reservation");
      }

      if (reserved.seller_id === buyerId) {
        await client.query("ROLLBACK");
        throw new ServiceError(400, "Cannot reserve your own listing");
      }

      // Create order
      const order = await this.orderRepo.create(
        input.listing_id,
        buyerId,
        reserved.seller_id,
        input.agreed_price,
        client,
      );

      // Transition to AWAITING_ESCROW
      const updatedOrder = await this.orderRepo.updateStatus(
        order.id,
        OrderStatus.AWAITING_ESCROW,
        client,
      );

      // Record transition
      await this.orderRepo.insertTransition(
        order.id,
        OrderStatus.CREATED,
        OrderStatus.AWAITING_ESCROW,
        buyerId,
        { listing_id: input.listing_id, agreed_price: input.agreed_price },
        client,
      );

      // Audit log
      await this.orderRepo.insertAuditLog(
        buyerId,
        "ORDER_CREATED",
        "order",
        order.id,
        { listing_id: input.listing_id },
        client,
      );

      await client.query("COMMIT");
      return updatedOrder;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async confirmEscrow(
    orderId: string,
    buyerId: string,
    escrowReference: string,
  ): Promise<Order> {
    return this.transitionOrder(
      orderId,
      buyerId,
      OrderStatus.AWAITING_ESCROW,
      OrderStatus.ESCROW_CONFIRMED,
      "ESCROW_CONFIRMED",
      "buyer",
      { escrow_reference: escrowReference },
    );
  }

  async shipOrder(orderId: string, sellerId: string): Promise<Order> {
    return this.transitionOrder(
      orderId,
      sellerId,
      OrderStatus.ESCROW_CONFIRMED,
      OrderStatus.SHIPPED,
      "ORDER_SHIPPED",
      "seller",
      null,
    );
  }

  async completeOrder(orderId: string, buyerId: string): Promise<Order> {
    return this.transitionOrder(
      orderId,
      buyerId,
      OrderStatus.SHIPPED,
      OrderStatus.COMPLETED,
      "ORDER_COMPLETED",
      "buyer",
      null,
    );
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.orderRepo.findById(orderId);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return this.orderRepo.findByUserId(userId);
  }

  /**
   * Generic order state transition inside a transaction.
   * Validates current state, updates order, inserts transition + audit.
   */
  private async transitionOrder(
    orderId: string,
    actorId: string,
    expectedState: string,
    newState: string,
    auditAction: string,
    requiredRole: "buyer" | "seller",
    extra: { escrow_reference?: string } | null,
  ): Promise<Order> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      const order = await this.orderRepo.findByIdForUpdate(orderId, client);
      if (!order) {
        throw new ServiceError(404, "Order not found");
      }

      // Role check
      if (requiredRole === "buyer" && order.buyer_id !== actorId) {
        throw new ServiceError(403, "Only the buyer can perform this action");
      }
      if (requiredRole === "seller" && order.seller_id !== actorId) {
        throw new ServiceError(403, "Only the seller can perform this action");
      }

      // State validation
      if (order.status !== expectedState) {
        throw new ServiceError(
          409,
          `Order is in state '${order.status}', expected '${expectedState}'`,
        );
      }

      // Update order
      const updatedOrder = await this.orderRepo.updateStatus(
        orderId,
        newState,
        client,
        extra ? { escrow_reference: extra.escrow_reference } : undefined,
      );

      // Update listing status for certain transitions
      if (newState === OrderStatus.SHIPPED) {
        await this.listingRepo.updateStatus(order.listing_id, "SHIPPED", client);
      } else if (newState === OrderStatus.COMPLETED) {
        await this.listingRepo.updateStatus(order.listing_id, "COMPLETED", client);
      }

      // Record state transition
      await this.orderRepo.insertTransition(
        orderId,
        expectedState,
        newState,
        actorId,
        extra,
        client,
      );

      // Audit log
      await this.orderRepo.insertAuditLog(
        actorId,
        auditAction,
        "order",
        orderId,
        { previous_state: expectedState, new_state: newState },
        client,
      );

      await client.query("COMMIT");
      return updatedOrder;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

export class ServiceError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}
