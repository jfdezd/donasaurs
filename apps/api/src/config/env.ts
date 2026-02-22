import { z } from "zod";

const baseEnvSchema = z.object({
  POSTGRES_URL: z.string().optional(),
  POSTGRES_PRISMA_URL: z.string().optional(),
  POSTGRES_URL_NON_POOLING: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
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
  const supabaseUrl = result.data.SUPABASE_URL ?? result.data.NEXT_PUBLIC_SUPABASE_URL;

  if (!databaseUrl || !supabaseUrl) {
    console.error("Available env var keys:", Object.keys(process.env).filter((k) =>
      /postgres|database|supabase/i.test(k)
    ));
  }

  if (!databaseUrl || !supabaseUrl) {
    console.error("Invalid environment variables:", {
      ...(!databaseUrl
        ? {
            POSTGRES_URL: ["Required when DATABASE_URL is not set"],
            DATABASE_URL: ["Required when POSTGRES_URL is not set"],
          }
        : {}),
      ...(!supabaseUrl
        ? {
            SUPABASE_URL: ["Required when NEXT_PUBLIC_SUPABASE_URL is not set"],
            NEXT_PUBLIC_SUPABASE_URL: ["Required when SUPABASE_URL is not set"],
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
