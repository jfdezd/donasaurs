import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { OrderService, ServiceError } from "../services/order-service.js";
import type { AuthUser } from "../middleware/auth.js";

const reserveSchema = z.object({
  listing_id: z.string().uuid(),
  agreed_price: z.number().positive(),
});

const confirmEscrowSchema = z.object({
  escrow_reference: z.string().min(1).max(500),
});

export async function orderRoutes(
  app: FastifyInstance,
  opts: { orderService: OrderService; authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void> },
): Promise<void> {
  const { orderService, authenticate } = opts;

  // All order routes require authentication
  app.addHook("preHandler", authenticate);

  app.get("/orders/mine", async (request) => {
    const user = request.user as AuthUser;
    return orderService.getOrdersByUser(user.sub);
  });

  app.get<{ Params: { id: string } }>("/orders/:id", async (request, reply) => {
    const user = request.user as AuthUser;
    const order = await orderService.getOrderById(request.params.id);
    if (!order) {
      return reply.code(404).send({ statusCode: 404, error: "Not Found", message: "Order not found" });
    }
    // Only buyer or seller can view
    if (order.buyer_id !== user.sub && order.seller_id !== user.sub) {
      return reply.code(403).send({ statusCode: 403, error: "Forbidden", message: "Not authorized to view this order" });
    }
    return order;
  });

  app.post("/orders/reserve", async (request, reply) => {
    const parsed = reserveSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: parsed.error.issues.map((i) => i.message).join(", "),
      });
    }

    try {
      const user = request.user as AuthUser;
      const order = await orderService.reserveListing(user.sub, user.email, parsed.data);
      return reply.code(201).send(order);
    } catch (err) {
      if (err instanceof ServiceError) {
        return reply.code(err.statusCode).send({ statusCode: err.statusCode, error: "Error", message: err.message });
      }
      throw err;
    }
  });

  app.post<{ Params: { id: string } }>("/orders/:id/confirm-escrow", async (request, reply) => {
    const parsed = confirmEscrowSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: parsed.error.issues.map((i) => i.message).join(", "),
      });
    }

    try {
      const user = request.user as AuthUser;
      const order = await orderService.confirmEscrow(
        request.params.id,
        user.sub,
        parsed.data.escrow_reference,
      );
      return order;
    } catch (err) {
      if (err instanceof ServiceError) {
        return reply.code(err.statusCode).send({ statusCode: err.statusCode, error: "Error", message: err.message });
      }
      throw err;
    }
  });

  app.post<{ Params: { id: string } }>("/orders/:id/ship", async (request, reply) => {
    try {
      const user = request.user as AuthUser;
      const order = await orderService.shipOrder(request.params.id, user.sub);
      return order;
    } catch (err) {
      if (err instanceof ServiceError) {
        return reply.code(err.statusCode).send({ statusCode: err.statusCode, error: "Error", message: err.message });
      }
      throw err;
    }
  });

  app.post<{ Params: { id: string } }>("/orders/:id/complete", async (request, reply) => {
    try {
      const user = request.user as AuthUser;
      const order = await orderService.completeOrder(request.params.id, user.sub);
      return order;
    } catch (err) {
      if (err instanceof ServiceError) {
        return reply.code(err.statusCode).send({ statusCode: err.statusCode, error: "Error", message: err.message });
      }
      throw err;
    }
  });
}
