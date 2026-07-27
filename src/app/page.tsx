import Image from "next/image";
import Link from "next/link";
import { db } from "@/db";
import { services } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { formatPricePence } from "@/lib/format";
import { ensureSeeded } from "@/lib/seed";
import GoogleReviews from "@/components/GoogleReviews";
import SectionHeading from "@/components/SectionHeading";
import WorkshopGallery from "@/components/WorkshopGallery";
import DatabaseNotice from "@/components/DatabaseNotice";
import { getGoogleReviews } from "@/lib/reviews";
import { CONTACT } from "@/lib/site";
import {
  AirConIcon,
  BatteryIcon,
  BrakeIcon,
  ClockIcon,
  DiagnosticsIcon,
  MotIcon,
  ShieldPoundIcon,
  SpannerIcon,
  TyreIcon,
} from "@/components/ServiceIcons";

/**
 * The full range, including jobs that are quoted rather than booked online.
 */
const CAPABILITIES = [
  { icon: MotIcon, title: "MOT testing", body: "Class 4 tests on site, with a free re-test within 10 working days.", href: "/services" },
  { icon: SpannerIcon, title: "Servicing", body: "Interim, full and major services to manufacturer schedules.", href: "/services" },
  { icon: TyreIcon, title: "Tyres & balancing", body: "Premium, mid-range and budget tyres, fitted and balanced.", href: "/tyres" },
  { icon: BrakeIcon, title: "Brakes & suspension", body: "Pads, discs, callipers, shocks and springs — inspected free.", href: "/services" },
  { icon: DiagnosticsIcon, title: "Diagnostics", body: "Engine management and electrical faults traced properly.", href: "/services" },
  { icon: AirConIcon, title: "Air-con recharge", body: "Re-gas and leak testing for R134a and R1234yf systems.", href: "/services" },
  { icon: BatteryIcon, title: "Batteries & exhausts", body: "Tested, supplied and fitted, usually the same day.", href: "/services" },
  { icon: ClockIcon, title: "While-you-wait", body: "Book the first slot of the day and be away within the hour.", href: "/book" },
];

const PROMISES = [
  { icon: ShieldPoundIcon, title: "Fixed, upfront pricing", body: "You get a written estimate before a spanner is lifted. If the job changes, we call you first — always." },
  { icon: MotIcon, title: "DVSA-approved station", body: `Vehicle testing station ${CONTACT.motSiteNumber}, with qualified testers and an MOT viewing area you're welcome to use.` },
  { icon: SpannerIcon, title: "6-month warranty", body: "Every part we fit and every hour we work is covered for 6 months or 6,000 miles. No small print." },
];

export const dynamic = "force-dynamic";

type ServiceRow = typeof services.$inferSelect;

/**
 * The marketing page must render even if the database is unreachable, so a
 * connection failure degrades the pricing grid rather than 500-ing the site.
 */
async function loadHeadlineServices(slugs: string[]): Promise<ServiceRow[] | null> {
  try {
    await ensureSeeded();
    const rows = await db.select().from(services).where(inArray(services.slug, slugs));
    const byslug = new Map(rows.map((r) => [r.slug, r]));
    return slugs.map((s) => byslug.get(s)).filter((s): s is ServiceRow => Boolean(s));
  } catch (error) {
    console.error("[home] could not load services:", error);
    return null;
  }
}

export default async function HomePage() {
  const reviews = await getGoogleReviews();
  const headlineSlugs = ["mot-test", "interim-service", "full-service", "major-service"];
  const cards = await loadHeadlineServices(headlineSlugs);

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-carbon-950 text-white">
        {/* Single, static backdrop — the workshop itself. */}
        <div aria-hidden className="absolute inset-0">
          <Image
            src="/images/workshop/shopfront-wide.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_42%]"
          />
          <div className="absolute inset-0 bg-carbon-950/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon-950 via-carbon-950/85 to-carbon-950/40" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-carbon-950 to-transparent" />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12% 18%, rgba(125,194,66,0.20), transparent 52%), radial-gradient(circle at 88% 78%, rgba(125,194,66,0.10), transparent 55%)",
            }}
          />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-400">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              DVSA-approved · Station {CONTACT.motSiteNumber}
            </p>

            <h1 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Straight-talking
              <span className="block text-brand-500">car care</span>
              in Middlesbrough.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-carbon-300">
              MOTs, servicing, diagnostics and tyres — all under one roof on
              Marton Road. Fixed prices, a written estimate before we start,
              and a 6-month warranty on everything we fit.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="rounded-md bg-brand-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-carbon-950 shadow-lg shadow-brand-500/25 transition hover:bg-brand-400"
              >
                Book your slot
              </Link>
              <a
                href={CONTACT.phoneHref}
                className="rounded-md border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:border-brand-500 hover:bg-white/10"
              >
                {CONTACT.phoneDisplay}
              </a>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <dt className="text-xs uppercase tracking-wider text-carbon-400">Google rating</dt>
                <dd className="mt-1 font-display text-3xl font-extrabold text-white">
                  {reviews.rating.toFixed(1)}
                  <span className="ml-1 text-lg text-brand-500">★</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-carbon-400">Warranty</dt>
                <dd className="mt-1 font-display text-3xl font-extrabold text-white">
                  6<span className="text-lg text-carbon-400"> mo</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-carbon-400">MOT re-test</dt>
                <dd className="mt-1 font-display text-3xl font-extrabold text-white">
                  Free
                </dd>
              </div>
            </dl>
          </div>

          {/* Quick-book card */}
          <div className="rounded-2xl border border-white/12 bg-carbon-950/70 p-6 shadow-2xl backdrop-blur-md lg:mt-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-400">
                Quick book
              </p>
              <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-[11px] font-bold uppercase text-brand-400">
                Free re-test
              </span>
            </div>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
              MOT from £54.95
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-carbon-300">
              Already booking an MOT? Add an Interim or Full Service and
              we&apos;ll do both in the one visit — saving you a second trip.
            </p>

            <ul className="mt-5 space-y-3 text-sm">
              {[
                "Free re-test within 10 working days",
                "MOT viewing area — watch the test yourself",
                "Waiting room with WiFi and free parking",
                "No deposit, pay at the workshop",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-carbon-200">
                  <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 flex-none text-brand-500" fill="currentColor" aria-hidden>
                    <path d="M8.2 13.6 5 10.4l1.3-1.3 1.9 1.9 5.5-5.5L15 6.8l-6.8 6.8Z" />
                  </svg>
                  {line}
                </li>
              ))}
            </ul>

            <Link
              href="/book?service=mot-test"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-white px-4 py-3.5 text-sm font-bold uppercase tracking-wide text-carbon-950 transition hover:bg-brand-500"
            >
              Book your MOT →
            </Link>
            <p className="mt-3 text-center text-xs text-carbon-400">
              Or call {CONTACT.phoneDisplay} — {CONTACT.hoursShort}
            </p>
          </div>
        </div>
      </section>

      {/* ── Promise strip ────────────────────────────────────────────── */}
      <section className="border-b border-carbon-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-4">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-carbon-950">
                  {title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-carbon-600">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Inside the workshop (replaces the old hero slider) ───────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          eyebrow="Inside the workshop"
          title={
            <>
              Real work,
              <span className="text-brand-500"> done properly</span>
            </>
          }
          intro="Two-post lifts, modern diagnostic kit and a dedicated tyre bay — with technicians who explain what they're doing and why."
          align="center"
        />
        <div className="mt-12">
          <WorkshopGallery />
        </div>
      </section>

      {/* ── Headline pricing ─────────────────────────────────────────── */}
      <section className="border-y border-carbon-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Bookable online"
              title={
                <>
                  Fixed prices.
                  <span className="text-brand-500"> No surprises.</span>
                </>
              }
              intro="The four jobs we're asked for most. Every price includes parts, labour and VAT."
            />
            <Link
              href="/services"
              className="hidden shrink-0 text-sm font-bold uppercase tracking-wide text-carbon-700 underline-offset-4 hover:text-brand-600 hover:underline sm:inline"
            >
              Full price list →
            </Link>
          </div>

          {cards === null ? (
            <div className="mt-10">
              <DatabaseNotice />
            </div>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((s, i) => (
                <div
                  key={s.slug}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                    i === 0
                      ? "border-brand-400 ring-1 ring-brand-300"
                      : "border-carbon-200 hover:border-brand-300"
                  }`}
                >
                  {i === 0 && (
                    <span className="absolute right-4 top-4 rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-carbon-950">
                      Most booked
                    </span>
                  )}
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
                    {s.category}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-carbon-950">
                    {s.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-carbon-600">
                    {s.description}
                  </p>
                  <p className="mt-5 font-display text-4xl font-extrabold text-carbon-950">
                    {formatPricePence(s.priceGbp)}
                  </p>
                  <Link
                    href={`/book?service=${s.slug}`}
                    className="mt-4 inline-flex items-center justify-center rounded-md bg-carbon-950 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition group-hover:bg-brand-500 group-hover:text-carbon-950"
                  >
                    Book now
                  </Link>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/services"
            className="mt-6 inline-flex text-sm font-bold uppercase tracking-wide text-carbon-700 underline-offset-4 hover:text-brand-600 hover:underline sm:hidden"
          >
            Full price list →
          </Link>
        </div>
      </section>

      {/* ── Everything we do ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          eyebrow="Under one roof"
          title="Everything your car needs"
          intro="One garage, one team, one place to bring it — from the annual test to the jobs that crop up in between."
          align="center"
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map(({ icon: Icon, title, body, href }) => (
            <li key={title}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-2xl border border-carbon-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-400 hover:shadow-lg"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-carbon-950 text-brand-500 transition group-hover:bg-brand-500 group-hover:text-carbon-950">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wide text-carbon-950">
                  {title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-carbon-600">
                  {body}
                </p>
                <span className="mt-3 text-sm font-bold text-brand-600 opacity-0 transition group-hover:opacity-100">
                  Learn more →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Find us / the actual shop ────────────────────────────────── */}
      <section className="border-y border-carbon-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-carbon-200 shadow-xl">
              <Image
                src="/images/brand/actual-shop.jpeg"
                alt="The Marton Road MOT Centre unit — black cladding with lime green signage, customer parking out front"
                width={1024}
                height={768}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon-950/85 to-transparent p-5 pt-16">
                <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
                  416 Marton Road
                </p>
                <p className="text-sm text-carbon-300">
                  Free customer parking directly outside
                </p>
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="Find us"
                title={
                  <>
                    Look for the
                    <span className="text-brand-500"> green sign</span>
                  </>
                }
                intro="We're the black unit on Marton Road, a few minutes from James Cook University Hospital. Pull straight onto the forecourt — reception is the door in the middle."
              />

              <ul className="mt-8 space-y-4">
                {[
                  ["Address", `${CONTACT.addressLine1}, ${CONTACT.town} ${CONTACT.postcode}`],
                  ["Opening hours", CONTACT.hoursShort],
                  ["Phone", CONTACT.phoneDisplay],
                ].map(([label, value]) => (
                  <li
                    key={label}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-carbon-200 pb-3"
                  >
                    <span className="w-32 shrink-0 text-xs font-bold uppercase tracking-[0.16em] text-carbon-500">
                      {label}
                    </span>
                    <span className="font-medium text-carbon-900">{value}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={CONTACT.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-md bg-carbon-950 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-carbon-800"
                >
                  Get directions
                </a>
                <Link
                  href="/contact"
                  className="rounded-md border border-carbon-300 bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-carbon-800 transition hover:border-brand-500 hover:text-brand-700"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────── */}
      <GoogleReviews summary={reviews} />

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-carbon-950 px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, rgba(125,194,66,0.22), transparent 55%), radial-gradient(circle at 85% 85%, rgba(125,194,66,0.14), transparent 55%)",
            }}
          />
          <div className="relative">
            <h2 className="font-display text-4xl font-extrabold uppercase leading-tight text-white sm:text-5xl">
              MOT due? <span className="text-brand-500">Book it today.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-carbon-300">
              Pick a service, choose a slot and you&apos;re done in under a
              minute. Instant confirmation, no deposit, and a reminder before
              your test is due.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/book"
                className="rounded-md bg-brand-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-carbon-950 shadow-lg shadow-brand-500/25 transition hover:bg-brand-400"
              >
                Book online
              </Link>
              <a
                href={CONTACT.phoneHref}
                className="rounded-md border border-white/25 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:border-brand-500 hover:bg-white/5"
              >
                Call {CONTACT.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
