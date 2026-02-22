import { z } from "zod";

const baseEnvSchema = z.object({
  POSTGRES_URL: z.string().min(1).optional(),
  POSTGRES_PRISMA_URL: z.string().min(1).optional(),
  POSTGRES_URL_NON_POOLING: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  SUPABASE_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1).optional(),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default("0.0.0.0"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

export interface Env {
  databaseUrl: string;
  supabaseUrl: string;
  port: number;
  host: string;
  corsOrigin: string;
}

function deriveSupabaseUrlFromDatabaseUrl(databaseUrl: string): string | undefined {
  try {
    const dbHost = new URL(databaseUrl).hostname;
    const match = dbHost.match(/^db\.([a-z0-9-]+)\.supabase\.co$/i);
    if (!match) return undefined;
    return `https://${match[1]}.supabase.co`;
  } catch {
    return undefined;
  }
}

export function loadEnv(): Env {
  const result = baseEnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error("Invalid environment variables:", result.error.flatten().fieldErrors);
    process.exit(1);
  }

  const databaseUrl =
    result.data.POSTGRES_URL ??
    result.data.POSTGRES_PRISMA_URL ??
    result.data.POSTGRES_URL_NON_POOLING ??
    result.data.DATABASE_URL;

  const explicitSupabaseUrl = result.data.SUPABASE_URL ?? result.data.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseUrl = explicitSupabaseUrl ?? (databaseUrl ? deriveSupabaseUrlFromDatabaseUrl(databaseUrl) : undefined);

  if (!databaseUrl || !supabaseUrl) {
    console.error("Invalid environment variables:", {
      ...(!databaseUrl
        ? {
            POSTGRES_URL: ["Required when POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING, and DATABASE_URL are not set"],
            POSTGRES_PRISMA_URL: ["Optional alternative database URL"],
            POSTGRES_URL_NON_POOLING: ["Optional alternative database URL"],
            DATABASE_URL: ["Required when no POSTGRES_* URL is set"],
          }
        : {}),
      ...(!supabaseUrl
        ? {
            SUPABASE_URL: ["Required when NEXT_PUBLIC_SUPABASE_URL is not set and cannot be derived from database host"],
            NEXT_PUBLIC_SUPABASE_URL: ["Required when SUPABASE_URL is not set and cannot be derived from database host"],
          }
        : {}),
    });
    process.exit(1);
  }

  return {
    databaseUrl,
    supabaseUrl,
    port: result.data.PORT,
    host: result.data.HOST,
    corsOrigin: result.data.CORS_ORIGIN,
  };
}
