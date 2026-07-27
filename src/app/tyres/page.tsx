import Link from "next/link";
import BrandGrid from "@/components/BrandGrid";
import BrandMarquee from "@/components/BrandMarquee";
import SectionHeading from "@/components/SectionHeading";
import { TYRE_BRANDS } from "@/lib/brands";
import { CONTACT } from "@/lib/site";

export const metadata = {
  title: "Tyres & fitting",
  description: `New tyres and expert fitting for all makes and models in Middlesbrough. Michelin, Goodyear, Dunlop, Continental, Bridgestone, Pirelli, Toyo, Yokohama and more. Call ${CONTACT.mobileDisplay}.`,
};

const HEADLINE_BRANDS = [
  "Michelin",
  "Goodyear",
  "Dunlop",
  "Continental",
  "Bridgestone",
  "Pirelli",
  "Toyo",
  "Yokohama",
];

const PRICING = [
  { label: "Tyre fitting from", price: "£18", note: "Per tyre — new valve, balancing and old tyre disposal included" },
  { label: "Wheel balancing", price: "£12", note: "Per wheel, dynamic computerised balancing" },
  { label: "4-wheel alignment", price: "£59", note: "Laser accurate, with a printed before-and-after report" },
];

export default function TyresPage() {
  return (
    <main>
      {/* ── Intro ────────────────────────────────────────────────────── */}
      <section className="border-b border-carbon-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionHeading
            as="h1"
            eyebrow="Wheels & tyres"
            title={
              <>
                New tyres, fitted properly —
                <span className="text-brand-500"> every car, every budget</span>
              </>
            }
            intro={`We supply tyres from all the brands you know and trust, including ${HEADLINE_BRANDS.join(", ")} and many more.`}
          />

          <div className="mt-6 max-w-3xl space-y-5 leading-relaxed text-carbon-700">
            <p>
              Every vehicle — and every driver — is different. That&apos;s why
              we hold a wide selection of new tyres and offer fitting for all
              makes and models, matched to your driving style, the roads you
              cover and the budget you have in mind. Our team will walk you
              through the options and help you land on the right tyre, whether
              that&apos;s a high-performance summer tyre, a year-round
              all-season, or a dependable budget-friendly alternative.
            </p>
            <p>
              Not sure where to start? We&apos;ll happily compare tyre
              specifications and prices with you before you buy, so you know
              you&apos;re getting the best tyres for your needs — and
              you&apos;re never sold more than the car actually needs.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={CONTACT.mobileHref}
              className="rounded-md bg-brand-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-carbon-950 shadow-lg shadow-brand-500/20 transition hover:bg-brand-400"
            >
              Call {CONTACT.mobileDisplay}
            </a>
            <Link
              href="/book"
              className="rounded-md bg-carbon-950 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-carbon-800"
            >
              Book tyre fitting
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {PRICING.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-carbon-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
                {item.label}
              </p>
              <p className="mt-2 font-display text-4xl font-extrabold text-carbon-950">
                {item.price}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-carbon-500">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What's included ──────────────────────────────────────────── */}
      <section className="border-y border-carbon-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="What's included"
            title="No surprise add-ons at the till"
            intro="The fitting price covers everything needed to put the tyre on the car and get you back on the road safely."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "New valve fitted as standard",
              "Computerised wheel balancing",
              "Old tyre disposal included",
              "Torqued to manufacturer spec",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 rounded-xl border border-carbon-200 bg-carbon-50/60 p-4 text-sm text-carbon-700"
              >
                <span
                  aria-hidden
                  className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-brand-500 text-carbon-950"
                >
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M8.2 13.6 5 10.4l1.3-1.3 1.9 1.9 5.5-5.5L15 6.8l-6.8 6.8Z" />
                  </svg>
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Brands ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Brands we supply"
          title="Premium, mid-range and budget"
          intro="We stock and source the tyre brands trusted on UK roads. Can't see the brand or size you need? Most are with us within 24 hours."
          align="center"
        />

        <div className="mt-10">
          <BrandMarquee brands={TYRE_BRANDS} speedSeconds={40} />
        </div>

        <div className="mt-8">
          <BrandGrid brands={TYRE_BRANDS} />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-carbon-950 px-6 py-12 sm:px-12">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 25%, rgba(125,194,66,0.22), transparent 55%)",
            }}
          />
          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold uppercase text-white sm:text-4xl">
              Need tyres fitting?
            </h2>
            <p className="mt-3 max-w-2xl text-carbon-300">
              Book any slot and add your tyre size and requirements in the
              notes — we&apos;ll have the right tyres ready and waiting when you
              arrive. Prefer to talk it through first? Call{" "}
              <a
                href={CONTACT.mobileHref}
                className="font-bold text-brand-400 underline underline-offset-4"
              >
                {CONTACT.mobileDisplay}
              </a>
              .
            </p>
            <Link
              href="/book"
              className="mt-6 inline-flex rounded-md bg-brand-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-carbon-950 transition hover:bg-brand-400"
            >
              Book a slot →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
