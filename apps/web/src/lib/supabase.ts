import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  "http://127.0.0.1:54321";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  "local-dev-placeholder-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.SUPABASE_URL) {
  console.warn(
    "Supabase URL missing. Set NEXT_PUBLIC_SUPABASE_URL (preferred) or SUPABASE_URL.",
  );
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.SUPABASE_PUBLISHABLE_KEY) {
  console.warn(
    "Supabase public key missing. Set NEXT_PUBLIC_SUPABASE_ANON_KEY (preferred) or SUPABASE_PUBLISHABLE_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
