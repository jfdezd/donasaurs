import type pg from "pg";
import type { Order } from "@donasaurs/domain";

export class OrderRepository {
  constructor(private pool: pg.Pool) {}

  async create(
    listingId: string,
    buyerId: string,
    sellerId: string,
    agreedPrice: number,
    client: pg.PoolClient,
  ): Promise<Order> {
    const result = await client.query<Order>(
      `INSERT INTO orders (listing_id, buyer_id, seller_id, agreed_price, status)
       VALUES ($1, $2, $3, $4, 'CREATED')
       RETURNING *`,
      [listingId, buyerId, sellerId, agreedPrice],
    );
    return result.rows[0];
  }

  async findById(id: string): Promise<Order | null> {
    const result = await this.pool.query<Order>(
      "SELECT * FROM orders WHERE id = $1",
      [id],
    );
    return result.rows[0] ?? null;
  }

  async findByIdForUpdate(id: string, client: pg.PoolClient): Promise<Order | null> {
    const result = await client.query<Order>(
      "SELECT * FROM orders WHERE id = $1 FOR UPDATE",
      [id],
    );
    return result.rows[0] ?? null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const result = await this.pool.query<Order>(
      `SELECT * FROM orders
       WHERE buyer_id = $1 OR seller_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  async updateStatus(
    orderId: string,
    status: string,
    client: pg.PoolClient,
    extra?: { escrow_reference?: string; escrow_confirmed_at?: string },
  ): Promise<Order> {
    let query: string;
    let params: unknown[];

    if (extra?.escrow_reference) {
      query = `UPDATE orders
               SET status = $2,
                   escrow_reference = $3,
                   escrow_confirmed_at = now(),
                   version = version + 1,
                   updated_at = now()
               WHERE id = $1
               RETURNING *`;
      params = [orderId, status, extra.escrow_reference];
    } else {
      query = `UPDATE orders
               SET status = $2,
                   version = version + 1,
                   updated_at = now()
               WHERE id = $1
               RETURNING *`;
      params = [orderId, status];
    }

    const result = await client.query<Order>(query, params);
    return result.rows[0];
  }

  async insertTransition(
    orderId: string,
    previousState: string | null,
    newState: string,
    actorId: string,
    metadata: Record<string, unknown> | null,
    client: pg.PoolClient,
  ): Promise<void> {
    await client.query(
      `INSERT INTO order_state_transitions (order_id, previous_state, new_state, actor_id, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [orderId, previousState, newState, actorId, metadata ?? null],
    );
  }

  async insertAuditLog(
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata: Record<string, unknown> | null,
    client: pg.PoolClient,
  ): Promise<void> {
    await client.query(
      `INSERT INTO audit_log (actor_id, action, entity_type, entity_id, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [actorId, action, entityType, entityId, metadata ?? null],
    );
  }
}
