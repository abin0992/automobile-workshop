# Marton Road MOT Centre

Website and online booking system for an independent car workshop in
Middlesbrough — MOT tests, servicing, repairs and tyres.

Built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4**,
**Drizzle ORM** and **PostgreSQL**.

---

## Quick start

Requires **Node.js 20+**. No PostgreSQL installation needed.

```bash
git clone https://github.com/abin0992/automobile-workshop.git
cd automobile-workshop
npm install
npm run preview
```

Then open <http://localhost:3000>.

`npm run preview` starts an embedded PostgreSQL instance, creates the schema,
seeds the service catalogue, builds the app and serves it. Press `Ctrl-C` to
stop everything.

While you're iterating on the design, use the hot-reloading version instead:

```bash
npm run preview:dev
```

---

## How local data works

The app needs a real PostgreSQL database (`DATABASE_URL`), but installing one
just to look at the site is a lot of friction. So the preview scripts boot
[PGlite](https://pglite.dev) — Postgres compiled to WebAssembly — and expose it
over the genuine Postgres wire protocol on `127.0.0.1:5432`.

The application connects with an ordinary connection string and cannot tell the
difference. No application code is stubbed, mocked or branched for preview mode.

- Schema is created on boot by `scripts/preview-db.mjs`.
- Service catalogue is seeded on first page load (`src/lib/seed.ts`).
- Data persists in `.preview-db/` (gitignored), so bookings you create while
  clicking around survive a restart. Delete that folder for a clean slate.

### Using your own PostgreSQL instead

If you already run Postgres, skip the embedded database entirely:

```bash
echo 'DATABASE_URL=postgresql://user:password@localhost:5432/your_db' > .env.local
npx drizzle-kit push   # create the tables
npm run dev
```

---

## Scripts

| Command               | What it does                                              |
| --------------------- | --------------------------------------------------------- |
| `npm run preview`     | Embedded Postgres + production build on `:3000`            |
| `npm run preview:dev` | Embedded Postgres + hot-reloading dev server on `:3000`    |
| `npm run preview:db`  | Embedded Postgres only, for pairing with `npm run dev`     |
| `npm run dev`         | Next.js dev server (expects your own `DATABASE_URL`)       |
| `npm run build`       | Production build                                           |
| `npm start`           | Serve a production build                                   |
| `npm run typecheck`   | `tsc --noEmit`                                             |
| `npm run lint`        | ESLint                                                     |

Ports are configurable: `PORT=4000 PREVIEW_DB_PORT=5555 npm run preview`.

---

## Environment variables

| Variable                 | Required | Purpose                                                         |
| ------------------------ | -------- | --------------------------------------------------------------- |
| `DATABASE_URL`           | Yes      | Postgres connection string. Set automatically by the preview scripts. |
| `GOOGLE_PLACES_API_KEY`  | No       | Fetches live Google reviews. Falls back to a bundled snapshot when unset. |

Put local values in `.env.local` (gitignored).

### Google reviews

The reviews section on the home page reads from the workshop's
[Google listing](https://maps.app.goo.gl/PcDKuRFMjA5Tqr2V8). Google does not
permit scraping review text, so live data requires a Places API key:

1. Enable the **Places API** in Google Cloud and create an API key.
2. Add `GOOGLE_PLACES_API_KEY=...` to `.env.local`.

With no key present, `src/lib/reviews.ts` serves a curated snapshot of the
listing so the page always renders. The Place ID is already configured.

---

## Project structure

```
src/
  app/
    page.tsx              Home — hero slider, brand wall, services, reviews
    tyres/                Tyres — copy, pricing, tyre brand logos
    services/             Full price list and catalogue
    book/                 Booking flow (form, confirmation, upsell)
    about/  contact/
    api/                  availability, bookings, health
  components/
    HeroSlider.tsx        Auto-advancing hero background carousel
    BrandMarquee.tsx      Scrolling logo wall
    BrandGrid.tsx         Static logo grid
    GoogleReviews.tsx     Google review cards and rating summary
  db/                     Drizzle schema and connection pool
  lib/                    availability, seed data, brands, reviews, formatting
public/images/
  slider/                 Hero background photography
  car-brands/             Car marque logos
  tyre-brands/            Tyre brand logos
scripts/
  preview.sh              One-command local preview
  preview-db.mjs          Embedded Postgres server
  gen-brand-marks.mjs     Regenerates the placeholder brand logos
```

### Brand logos

`public/images/car-brands/` and `public/images/tyre-brands/` currently hold
generated placeholder wordmarks, not official trademarked artwork. To use the
real logos, drop them in using the same filenames (e.g. `michelin.svg`) and they
are picked up automatically — the brand lists live in `src/lib/brands.ts`.

---

## Troubleshooting

**`EADDRINUSE: address already in use :::3000`** — something is already on the
port. Stop it, or run `PORT=3001 npm run preview`.

**`Error: DATABASE_URL is required`** — you ran `npm run dev` or `npm start`
directly without a database. Use `npm run preview`, or set `DATABASE_URL` in
`.env.local`.

**Port 5432 already in use** — you have a real Postgres running. Either point
the app at it (see above) or move the embedded one:
`PREVIEW_DB_PORT=5555 npm run preview`.

**Stale or broken preview data** — `rm -rf .preview-db` and start again.
