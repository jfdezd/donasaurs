import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;

function normalizeConnectionString(databaseUrl: string): string {
  const url = new URL(databaseUrl);
  const sslmode = url.searchParams.get("sslmode")?.toLowerCase();
  const hasCompatFlag = url.searchParams.has("uselibpqcompat");

  // pg-connection-string treats sslmode=require/prefer/verify-ca as verify-full.
  // Add libpq compatibility explicitly unless caller already opted in or pinned verify-full.
  if (!hasCompatFlag && sslmode && sslmode !== "verify-full") {
    url.searchParams.set("uselibpqcompat", "true");
  }

  return url.toString();
}

export function getPool(databaseUrl: string): pg.Pool {
  if (!pool) {
    const normalizedConnectionString = normalizeConnectionString(databaseUrl);

    pool = new Pool({
      connectionString: normalizedConnectionString,
      max: 20,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
