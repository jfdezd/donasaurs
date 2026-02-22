import type pg from "pg";
import type { Listing } from "@donasaurs/domain";

export class ListingRepository {
  constructor(private pool: pg.Pool) {}

  async create(
    sellerId: string,
    title: string,
    description: string | null,
    priceMin: number,
  ): Promise<Listing> {
    const result = await this.pool.query<Listing>(
      `INSERT INTO listings (seller_id, title, description, price_min)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [sellerId, title, description, priceMin],
    );
    return result.rows[0];
  }

  async findAll(): Promise<Listing[]> {
    const result = await this.pool.query<Listing>(
      "SELECT * FROM listings ORDER BY created_at DESC",
    );
    return result.rows;
  }

  async findById(id: string): Promise<Listing | null> {
    const result = await this.pool.query<Listing>(
      "SELECT * FROM listings WHERE id = $1",
      [id],
    );
    return result.rows[0] ?? null;
  }

  /**
   * Atomically reserve a listing. Returns the listing if successful, null if
   * the listing was not ACTIVE (prevents double-reserve).
   */
  async reserveAtomically(
    listingId: string,
    buyerId: string,
    client: pg.PoolClient,
  ): Promise<Listing | null> {
    const result = await client.query<Listing>(
      `UPDATE listings
       SET status = 'RESERVED',
           reserved_by = $2,
           reserved_at = now(),
           version = version + 1,
           updated_at = now()
       WHERE id = $1
         AND status = 'ACTIVE'
       RETURNING *`,
      [listingId, buyerId],
    );
    return result.rows[0] ?? null;
  }

  async updateStatus(
    listingId: string,
    status: string,
    client: pg.PoolClient,
  ): Promise<Listing | null> {
    const result = await client.query<Listing>(
      `UPDATE listings
       SET status = $2, version = version + 1, updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [listingId, status],
    );
    return result.rows[0] ?? null;
  }
}
