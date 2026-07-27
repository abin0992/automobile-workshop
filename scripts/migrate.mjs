/**
 * Applies pending database migrations, then exits.
 *
 * Runs as part of `npm run build`, so a deployment can never end up serving
 * against a database whose tables do not exist. That was previously a manual
 * step — someone had to remember to run `drizzle-kit push` by hand against
 * production — and forgetting it produced a site that looked fine but showed
 * "our price list is temporarily unavailable" on /services and returned a 500
 * from /book.
 *
 * Deliberate behaviours:
 *
 *   · No DATABASE_URL  → skip quietly and exit 0. Preview builds, CI lint
 *     runs and contributors without a database must still be able to build.
 *     Note this cannot be delegated to drizzle.config.ts, which falls back to
 *     a localhost connection string; on a build host that host does not
 *     exist, so the command would hang and then fail.
 *
 *   · Migration fails  → exit non-zero and fail the build. Shipping a release
 *     whose code expects a column the database does not have is worse than
 *     not shipping it.
 *
 * Migrations are idempotent: drizzle records applied migrations in its own
 * `drizzle.__drizzle_migrations` table, so re-running on an up-to-date
 * database is a no-op.
 */
import { spawnSync } from "node:child_process";

const url = process.env.DATABASE_URL;

if (!url) {
  console.log(
    "[migrate] DATABASE_URL is not set — skipping migrations.\n" +
      "[migrate] The app will build, but any page backed by the database will\n" +
      "[migrate] degrade until DATABASE_URL is configured.",
  );
  process.exit(0);
}

// Log where we are pointed without ever printing credentials.
try {
  const { hostname, pathname } = new URL(url);
  console.log(`[migrate] applying migrations to ${hostname}${pathname}`);
} catch {
  console.log("[migrate] applying migrations");
}

const result = spawnSync(
  "npx",
  ["drizzle-kit", "migrate", "--config", "drizzle.config.ts"],
  { stdio: "inherit", env: process.env },
);

if (result.error) {
  console.error("[migrate] failed to start drizzle-kit:", result.error.message);
  process.exit(1);
}

if (result.status !== 0) {
  console.error(
    `\n[migrate] migrations failed (exit ${result.status}).\n` +
      "[migrate] The build is being stopped so a release is not deployed\n" +
      "[migrate] against a database it cannot use.\n" +
      "[migrate] Check DATABASE_URL, and that the role may create tables.",
  );
  process.exit(result.status ?? 1);
}

console.log("[migrate] database is up to date.");
