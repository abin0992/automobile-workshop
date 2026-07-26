import Link from "next/link";
import BrandGrid from "@/components/BrandGrid";
import BrandMarquee from "@/components/BrandMarquee";
import { TYRE_BRANDS } from "@/lib/brands";

export const metadata = {
  title: "Tyres — New Tyres & Fitting | Marton Road MOT Centre",
  description:
    "New tyres and expert fitting for all makes and models. Michelin, Goodyear, Dunlop, Continental, Bridgestone, Pirelli, Toyo, Yokohama and more. Call 07454 293416.",
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

export default function TyresPage() {
  return (
    <main>
      {/* Intro */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm font-medium uppercase tracking-wider text-amber-600">
          Wheels &amp; Tyres
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-950">
          New tyres and expert fitting — for every car, every budget
        </h1>

        <div className="mt-6 max-w-3xl space-y-5 text-lg leading-relaxed text-slate-700">
          <p>
            <strong className="font-semibold text-slate-900">We</strong> supply
            tyres from all the brands you know and trust, including{" "}
            {HEADLINE_BRANDS.join(", ")} and many more.
          </p>
          <p>
            Every vehicle — and every driver — is different. That&apos;s why we
            hold a wide selection of new tyres and offer fitting for all makes
            and models, matched to your driving style, the roads you cover and
            the budget you have in mind. Our experienced team will walk you
            through the options and help you land on the right tyre for your
            car, whether that&apos;s a high-performance summer tyre, a
            year-round all-season, or a dependable budget-friendly alternative.
            Because we lead with quality and customer satisfaction, you can rely
            on{" "}
            <strong className="font-semibold text-slate-900">us</strong> to fit
            tyres that deliver outstanding grip, long life and a comfortable,
            quiet ride whatever the road throws at you.
          </p>
          <p>
            Whatever you drive and whatever your budget, we can help. Call us on{" "}
            <a
              href="tel:+447454293416"
              className="font-semibold text-slate-900 underline underline-offset-4 hover:text-amber-600"
            >
              07454 293416
            </a>{" "}
            with your enquiry.
          </p>
          <p>
            Not sure where to start? We&apos;ll happily compare tyre
            specifications and prices with you before you buy, so you know
            you&apos;re getting the best new tyres for your needs and your
            budget.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="tel:+447454293416"
            className="inline-flex items-center rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-amber-300"
          >
            Call 07454 293416
          </a>
          <Link
            href="/book"
            className="inline-flex items-center rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Book tyre fitting
          </Link>
        </div>
      </section>

      {/* What's included */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-10 sm:grid-cols-3 sm:px-6">
          <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Fitting from
            </p>
            <p className="mt-1 text-2xl font-bold">£18</p>
            <p className="mt-1 text-xs text-slate-500">
              Per tyre — new valve, balancing and old tyre disposal included
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Wheel balancing
            </p>
            <p className="mt-1 text-2xl font-bold">£12</p>
            <p className="mt-1 text-xs text-slate-500">Per wheel</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              4-wheel alignment
            </p>
            <p className="mt-1 text-2xl font-bold">£59</p>
            <p className="mt-1 text-xs text-slate-500">Laser accurate</p>
          </div>
        </div>
      </section>

      {/* Tyre brand logos */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-amber-600">
            Brands we supply
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            Premium, mid-range and budget tyres
          </h2>
          <p className="mt-4 text-slate-600">
            We stock and source the tyre brands trusted on UK roads. Can&apos;t
            see the brand or size you need? Most are with us within 24 hours.
          </p>
        </div>

        <div className="mt-10">
          <BrandMarquee brands={TYRE_BRANDS} speedSeconds={40} />
        </div>

        <div className="mt-8">
          <BrandGrid brands={TYRE_BRANDS} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-xl bg-slate-950 p-8 text-white">
          <h2 className="text-2xl font-bold">Need tyres fitting?</h2>
          <p className="mt-2 max-w-2xl text-slate-300">
            Book any slot and add your tyre size and requirements in the notes —
            we&apos;ll have the right tyres ready and waiting when you arrive.
            Prefer to talk it through first? Call{" "}
            <a
              href="tel:+447454293416"
              className="font-semibold text-white underline underline-offset-4"
            >
              07454 293416
            </a>
            .
          </p>
          <Link
            href="/book"
            className="mt-5 inline-flex items-center rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Book a slot →
          </Link>
        </div>
      </section>
    </main>
  );
}
