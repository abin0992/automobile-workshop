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

await db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id serial PRIMARY KEY,
    slug varchar(80) NOT NULL UNIQUE,
    name varchar(160) NOT NULL,
    category varchar(80) NOT NULL,
    description text NOT NULL,
    price_gbp integer NOT NULL,
    duration_minutes integer NOT NULL,
    bookable boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id serial PRIMARY KEY,
    reference varchar(24) NOT NULL UNIQUE,
    service_slug varchar(80) NOT NULL,
    addon_slug varchar(80),
    customer_name varchar(160) NOT NULL,
    email varchar(200) NOT NULL,
    phone varchar(40) NOT NULL,
    vehicle_reg varchar(20) NOT NULL,
    vehicle_details varchar(200) NOT NULL,
    booking_date date NOT NULL,
    time_slot time NOT NULL,
    notes text,
    status varchar(24) NOT NULL DEFAULT 'confirmed',
    created_at timestamp NOT NULL DEFAULT now()
  );
`);

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
