import Link from "next/link";
import { db } from "@/db";
import { services } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { formatPricePence } from "@/lib/format";
import { ensureSeeded } from "@/lib/seed";
import HeroSlider from "@/components/HeroSlider";
import BrandMarquee from "@/components/BrandMarquee";
import BrandGrid from "@/components/BrandGrid";
import GoogleReviews from "@/components/GoogleReviews";
import { CAR_BRANDS } from "@/lib/brands";
import { getGoogleReviews } from "@/lib/reviews";
import DatabaseNotice from "@/components/DatabaseNotice";

const SLIDES = [
  { src: "/images/slider/slider-1.jpg", alt: "Car raised on a two-post lift in our Middlesbrough workshop" },
  { src: "/images/slider/slider-2.jpg", alt: "Technician carrying out a DVSA MOT test" },
  { src: "/images/slider/slider-3.jpg", alt: "New tyres being fitted and balanced in our tyre bay" },
  { src: "/images/slider/slider-4.jpg", alt: "Engine bay servicing and oil check" },
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
      {/* Hero with image slider background */}
      <HeroSlider slides={SLIDES}>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> DVSA Approved MOT Station
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Honest, expert car care in the heart of Middlesbrough.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Family-run since 2004. MOT tests, servicing, diagnostics and tyres —
              all under one roof, with transparent fixed prices.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-300"
              >
                Book a service
              </Link>
              <Link
                href="/services"
                className="rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View prices
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-sm">
              <div>
                <dt className="text-slate-400">Reviews</dt>
                <dd className="mt-1 text-xl font-semibold">{reviews.rating.toFixed(1)} ★</dd>
              </div>
              <div>
                <dt className="text-slate-400">Since</dt>
                <dd className="mt-1 text-xl font-semibold">2004</dd>
              </div>
              <div>
                <dt className="text-slate-400">Warranty</dt>
                <dd className="mt-1 text-xl font-semibold">12 mo.</dd>
              </div>
            </dl>
          </div>

          {/* Quick booking teaser card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
            <p className="text-sm font-medium text-amber-300">Quick book</p>
            <h2 className="mt-2 text-2xl font-semibold">MOT from £54.95</h2>
            <p className="mt-2 text-sm text-slate-300">
              While you&apos;re here, add an Interim or Full Service and save on
              labour — we&apos;ll do it in one visit.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                "Free re-test within 10 days",
                "Courtesy waiting area with WiFi",
                "SMS reminders — never miss another test",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2 text-slate-200">
                  <span className="mt-0.5 text-amber-300">✓</span>
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/book?service=mot-test"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Book your MOT →
            </Link>
          </div>
        </div>
      </HeroSlider>

      {/* We repair all car brands */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-amber-600">
              All makes &amp; models
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              We repair <span className="text-amber-500">all car brands</span>
            </h2>
            <p className="mt-4 text-slate-600">
              From everyday hatchbacks to prestige German saloons, our
              dealer-trained technicians service, MOT and repair every marque on
              UK roads — using genuine or OE-matching parts, with your
              manufacturer warranty protected.
            </p>
          </div>

          <div className="mt-10">
            <BrandMarquee brands={CAR_BRANDS} />
            <BrandMarquee brands={[...CAR_BRANDS].reverse()} speedSeconds={55} />
          </div>

          <div className="mt-10 hidden md:block">
            <BrandGrid brands={CAR_BRANDS.slice(0, 12)} />
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t see your badge? We work on it too —{" "}
            <Link href="/contact" className="font-semibold text-slate-800 underline underline-offset-4">
              ask us about your vehicle
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-amber-600">
              Bookable services
            </p>
            <h2 className="mt-1 text-3xl font-bold text-slate-950">
              Fixed prices. No surprises.
            </h2>
          </div>
          <Link
            href="/services"
            className="hidden text-sm font-semibold text-slate-700 underline-offset-4 hover:underline sm:inline"
          >
            View full price list →
          </Link>
        </div>

        {cards === null ? (
          <div className="mt-8">
            <DatabaseNotice />
          </div>
        ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((s) => (
            <div
              key={s.slug}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {s.category}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{s.name}</h3>
              <p className="mt-2 flex-1 text-sm text-slate-600">{s.description}</p>
              <p className="mt-4 text-2xl font-bold text-slate-950">
                {formatPricePence(s.priceGbp)}
              </p>
              <Link
                href={`/book?service=${s.slug}`}
                className="mt-4 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Book now
              </Link>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* Trust strip */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
          {[
            {
              title: "DVSA approved",
              body: "MOT class 4 with fully qualified testers.",
              icon: "🛡️",
            },
            {
              title: "12-month warranty",
              body: "On all parts and labour, no small print.",
              icon: "🔧",
            },
            {
              title: "Fair, upfront pricing",
              body: "Written estimate before any work starts.",
              icon: "💷",
            },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <span className="text-3xl" aria-hidden>
                {f.icon}
              </span>
              <div>
                <p className="text-base font-semibold">{f.title}</p>
                <p className="mt-1 text-sm text-slate-600">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Google reviews */}
      <GoogleReviews summary={reviews} />
    </main>
  );
}
