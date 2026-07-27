/**
 * Local preview database.
 *
 * The sandbox/dev machine may not have PostgreSQL installed, so this starts an
 * embedded PGlite instance and exposes it over the real Postgres wire protocol
 * on 127.0.0.1:5432. The app can then connect with the usual DATABASE_URL and
 * behave exactly as it would against a real server.
 *
 *   node scripts/preview-db.mjs
 *   DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db npm run dev
 *
 * Data lives in .preview-db/ (gitignored) so bookings survive restarts.
 */
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

const PORT = Number(process.env.PREVIEW_DB_PORT ?? 5432);
const HOST = process.env.PREVIEW_DB_HOST ?? "127.0.0.1";

const db = await PGlite.create({ dataDir: ".preview-db" });

/*
 * The schema is NOT created here.
 *
 * This script used to carry its own copy of the CREATE TABLE statements,
 * which had two problems: that copy could silently drift from
 * src/db/schema.ts, and pre-creating the tables made `drizzle-kit migrate`
 * fail on "relation already exists" — the migration journal was empty, so it
 * replayed 0000_init against tables that were already there.
 *
 * `npm run build` now applies migrations, so the preview database is left
 * empty and drizzle owns the schema in every environment.
 */

// pg's Pool opens several sockets; the server defaults to a single connection.
const server = new PGLiteSocketServer({
  db,
  port: PORT,
  host: HOST,
  maxConnections: 20,
});
await server.start();
console.log(`[preview-db] postgres ready on ${HOST}:${PORT}`);

const shutdown = async () => {
  await server.stop();
  await db.close();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
