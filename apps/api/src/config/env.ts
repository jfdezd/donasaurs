import { z } from "zod";

const baseEnvSchema = z.object({
  POSTGRES_URL: z.string().url().optional(),
  DATABASE_URL: z.string().url().optional(),
  SUPABASE_URL: z.string().url(),
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

  const databaseUrl = result.data.POSTGRES_URL ?? result.data.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Invalid environment variables:", {
      POSTGRES_URL: ["Required when DATABASE_URL is not set"],
      DATABASE_URL: ["Required when POSTGRES_URL is not set"],
    });
    process.exit(1);
  }

  return {
    databaseUrl,
    supabaseUrl: result.data.SUPABASE_URL,
    port: result.data.PORT,
    host: result.data.HOST,
    corsOrigin: result.data.CORS_ORIGIN,
  };
}
