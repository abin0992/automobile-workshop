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

Already have a **Supabase** database? See
[Running against Supabase](#running-against-supabase) instead.

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

## Running against Supabase

Supabase is plain PostgreSQL, so the app connects to it with no code changes —
you only need the right connection string in `.env.local`.

### 1. Copy your connection string

In the Supabase dashboard go to **Project Settings → Database → Connection
string** and choose the **URI** tab. You will see two kinds of host:

| Connection type      | Host                                     | Port   | Use it for                          |
| -------------------- | ---------------------------------------- | ------ | ----------------------------------- |
| **Transaction pooler** | `aws-0-<region>.pooler.supabase.com`   | `6543` | The running app (recommended)       |
| **Session pooler / direct** | `aws-0-<region>.pooler.supabase.com` or `db.<ref>.supabase.co` | `5432` | Schema migrations (`drizzle-kit`)   |

Use the **pooler** for the app. This project uses `pg.Pool`, and Supabase's
direct connection allows only a small number of concurrent connections, which a
dev server will exhaust quickly.

### 2. Create `.env.local`

```bash
DATABASE_URL="postgresql://postgres.<project-ref>:<your-password>@aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require"
```

Notes that save a lot of debugging:

- The username on the pooler is `postgres.<project-ref>`, **not** `postgres`.
- Wrap the value **in double quotes** — Supabase passwords often contain `#`,
  `?` or `&`, which otherwise truncate the string.
- If your password contains `@`, `/`, `:` or `#`, percent-encode it
  (`@` → `%40`, `#` → `%23`). Or just reset it to an alphanumeric password.
- `?sslmode=require` is needed; Supabase refuses unencrypted connections.

### 3. Create the tables

`drizzle.config.ts` reads the same `DATABASE_URL` from `.env.local`, so this
targets your Supabase project automatically:

```bash
npx drizzle-kit push
```

This creates the `services` and `bookings` tables. If it hangs or times out,
switch the port in `DATABASE_URL` from `6543` to `5432` for this command only —
the transaction pooler does not support every statement migrations need.

You can confirm the tables exist under **Table Editor** in the dashboard.

### 4. Run the app

```bash
npm run dev          # http://localhost:3000
```

The service catalogue seeds itself on first page load. Do **not** use
`npm run preview` here — that starts the embedded database and ignores
Supabase.

### Supabase troubleshooting

| Symptom | Cause and fix |
| ------- | ------------- |
| `password authentication failed` | Username must be `postgres.<project-ref>` on pooler ports, and special characters in the password need percent-encoding. |
| `getaddrinfo ENOTFOUND` | Host copied incorrectly, or the project is paused — free projects pause after inactivity. Resume it in the dashboard. |
| `no pg_hba.conf entry ... no encryption` | Add `?sslmode=require` to the URL. |
| `self-signed certificate in certificate chain` | Corporate proxy intercepting TLS. Use `?sslmode=no-verify`. |
| `too many clients already` | You are on the direct connection. Move to the pooler on port `6543`. |
| `relation "services" does not exist` | Step 3 was skipped — run `npx drizzle-kit push`. |
| `drizzle-kit push` hangs | Use the session pooler / direct port `5432` for migrations. |

### Switching back to the embedded database

Delete or comment out `DATABASE_URL` in `.env.local`, then run
`npm run preview` as usual.

---

## Deploying to the cloud (free)

To share a link with a non-technical colleague, deploy to **Netlify**. It pulls
directly from a chosen Git branch, rebuilds on every push, and gives you a URL
like `https://marton-road-mot.netlify.app`.

**Why Netlify and not Vercel here:** Vercel's free Hobby plan is restricted to
personal, *non-commercial* use, and a business website falls outside that even
at zero traffic. Netlify's free Starter plan permits commercial use, and it
officially supports Next.js 16 (this project's version) via its auto-installed
Next.js runtime. Your Supabase database is separate and stays free.

### 1. Connect the repository

1. Sign in to [netlify.com](https://netlify.com) with GitHub.
2. **Add new site → Import an existing project** → pick this repository.
3. Netlify detects Next.js and fills in the build command and publish
   directory. `netlify.toml` in this repo already pins them plus Node 22.

### 2. Choose the branch

Under **Site configuration → Build & deploy → Branches and deploy contexts**,
set the **production branch** to the branch you want live — for example
`arena/019fa038-automobile-workshop` rather than `main`. Every push to that
branch redeploys automatically.

### 3. Add environment variables

**Site configuration → Environment variables.** At minimum:

| Key | Value |
| --- | ----- |
| `DATABASE_URL` | Your Supabase **transaction pooler** URI (port `6543`, with `?sslmode=require`) |

Optional: `GOOGLE_PLACES_API_KEY` for live reviews, and `SITE_PASSWORD` /
`SITE_USERNAME` for the password gate below.

Run `npx drizzle-kit push` once from your machine (with the same
`DATABASE_URL` in `.env.local`) so the tables exist before the first visit.

### 4. Deploy

Trigger a deploy and share the resulting URL. Nothing to install at the other
end — it opens in any browser, on phone or desktop.

### Keeping it private (internal use only)

The deployed URL is public and guessable by search engines. Netlify's built-in
password protection is a paid feature, so this project includes a free
alternative: set **`SITE_PASSWORD`** (and optionally `SITE_USERNAME`, default
`team`) in the Netlify environment variables and redeploy.

Visitors then get a browser username/password prompt before seeing anything.
Send your colleague the URL plus those two words. With `SITE_PASSWORD` unset
the gate is disabled entirely, so local development is unaffected.

The logic lives in `src/proxy.ts`. Static images are intentionally excluded
from the prompt so pages render correctly once you are through it.

### Alternatives considered

| Platform | Free tier verdict |
| -------- | ----------------- |
| **Netlify** | Recommended — commercial use allowed, Next.js 16 supported, deploys from any branch. |
| **Vercel** | Best Next.js support, but Hobby forbids commercial use; needs Pro at $20/mo. |
| **Render** | Free web services sleep after ~15 min idle, so the first visit takes 30–60s to wake. Fine for occasional internal use, poor first impression. |
| **Cloudflare Workers** | Free and fast, but this app needs the Node runtime and an adapter — more setup than it is worth here. |

### "This page couldn't load — a server error occurred"

Almost always the deployed app cannot reach the database. Open
**`https://<your-site>.netlify.app/api/health`** — it returns a plain-English
diagnosis rather than an opaque error code, for example:

```json
{ "ok": false, "stage": "schema",
  "problem": "Connected to the database, but the tables are missing.",
  "fix": "Run `npx drizzle-kit push` locally with the same DATABASE_URL to create them." }
```

The two most common causes:

1. **Tables were never created.** Put your Supabase `DATABASE_URL` in
   `.env.local` locally and run `npx drizzle-kit push`, then reload the site.
2. **Wrong connection string.** Netlify runs serverless, so use the Supabase
   **transaction pooler** host on port `6543` with `?sslmode=require`, and
   remember the username is `postgres.<project-ref>`.

After changing an environment variable in Netlify you must **redeploy** —
variables are baked in at build time, so saving alone does not apply them.

Pages no longer fail outright when the database is down: the marketing content
still renders and only the pricing section shows a notice, so a bad connection
never takes the whole site offline.

### Deployment troubleshooting

| Symptom | Fix |
| ------- | --- |
| Build fails on `DATABASE_URL is required` | The variable is missing in Netlify's environment settings. |
| Site loads but pages 500 | Tables not created — run `npx drizzle-kit push` against Supabase. |
| `too many clients already` | Use the pooler URI on port `6543`, not the direct connection. |
| Colleague sees a login box unexpectedly | `SITE_PASSWORD` is set. Share the credentials, or remove the variable to make it open. |
| Pushes do not redeploy | The production branch in Netlify does not match the branch you are pushing to. |

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
| `DATABASE_URL`           | Yes      | Postgres connection string — Supabase, your own server, or set automatically by the preview scripts. |
| `GOOGLE_PLACES_API_KEY`  | No       | Fetches live Google reviews. Falls back to a bundled snapshot when unset. |
| `SITE_PASSWORD`          | No       | Enables a Basic Auth prompt on every page. Unset means the site is open. |
| `SITE_USERNAME`          | No       | Username for that prompt. Defaults to `team`.                     |

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
  proxy.ts                Optional Basic Auth gate for internal deployments
  db/                     Drizzle schema and connection pool
  lib/                    availability, seed data, brands, reviews, formatting
public/images/
  slider/                 Hero background photography
  car-brands/             Car marque logos
  tyre-brands/            Tyre brand logos
drizzle.config.ts         Migration config — reads DATABASE_URL from .env.local
netlify.toml              Netlify build settings
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
