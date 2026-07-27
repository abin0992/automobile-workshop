import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

/**
 * Neon (and most hosted Postgres) requires TLS.
 *
 * `pg` only enables TLS when told to. Its connection-string parser turns
 * `?sslmode=require` into an empty `ssl: {}` object, which connects over TLS
 * but — because `rejectUnauthorized` defaults to undefined — does *not*
 * verify the server certificate. That is a silent downgrade, so TLS is
 * configured explicitly here instead of relying on the query parameter.
 *
 * Local development against the embedded PGlite preview database has no TLS
 * at all, so SSL is enabled only for non-local hosts.
 */
function sslConfig(url: string): PoolConfig["ssl"] {
  let host: string;
  let sslmode: string | null;

  try {
    const parsed = new URL(url);
    host = parsed.hostname;
    sslmode = parsed.searchParams.get("sslmode");
  } catch {
    return undefined;
  }

  // Explicitly disabled — honour it (used by some self-hosted setups).
  if (sslmode === "disable") return undefined;

  const isLocal =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local");

  if (isLocal) return undefined;

  // `no-verify` is an intentional opt-out, e.g. for a proxy with a self-
  // signed certificate. Anything else gets full verification.
  if (sslmode === "no-verify" || sslmode === "prefer") {
    return { rejectUnauthorized: false };
  }

  return { rejectUnauthorized: true };
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: sslConfig(databaseUrl),
    /**
     * Neon's pooler and serverless platforms both drop idle connections.
     * Keeping the pool small and recycling idle clients quickly avoids
     * handing out a socket the far end has already closed.
     */
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

/**
 * An idle client erroring (Neon scaling to zero, a network blip) emits an
 * error on the pool. Without a listener, Node treats it as unhandled and
 * terminates the process.
 */
pool.on("error", (error) => {
  console.error("[db] idle client error:", error);
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
