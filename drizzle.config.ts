import { config as loadEnv } from "dotenv";
import type { Config } from "drizzle-kit";

// .env.local wins over .env, matching Next.js behaviour.
loadEnv({ path: ".env.local" });
loadEnv();

/**
 * Drizzle reads the same DATABASE_URL as the app, so `drizzle-kit push`
 * always targets whichever database you are pointed at (Supabase, your own
 * Postgres, or the embedded preview database).
 *
 * Values are loaded from .env.local if present, then .env.
 */
const url =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

export default {
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
} satisfies Config;
