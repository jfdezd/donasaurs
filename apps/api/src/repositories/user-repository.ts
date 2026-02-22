import type pg from "pg";
import type { User } from "@donasaurs/domain";

export class UserRepository {
  constructor(private pool: pg.Pool) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query<User>(
      "SELECT * FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0] ?? null;
  }

  async ensureUser(id: string, email: string): Promise<User> {
    const result = await this.pool.query<User>(
      `INSERT INTO users (id, email, username)
       VALUES ($1, $2, split_part($2, '@', 1))
       ON CONFLICT (id) DO UPDATE SET updated_at = now()
       RETURNING *`,
      [id, email],
    );
    return result.rows[0];
  }
}
