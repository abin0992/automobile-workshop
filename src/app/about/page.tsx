import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { CONTACT } from "@/lib/site";
import {
  MotIcon,
  ShieldPoundIcon,
  SpannerIcon,
  TyreIcon,
} from "@/components/ServiceIcons";

export const metadata = {
  title: "About us",
  description:
    "An independent, family-run MOT and service centre on Marton Road, Middlesbrough. DVSA-approved, fixed prices and a 6-month warranty on every job.",
};

const STATS = [
  { value: "40,000+", label: "MOT tests carried out since we opened" },
  { value: "6", label: "Full-time technicians, each with 10+ years' experience" },
  { value: "4.5 ★", label: "Average rating across our Google reviews" },
  { value: "100%", label: "No work started without your say-so. Ever." },
];

const PROMISES = [
  "We call you before starting any work you haven't already approved.",
  "Every job comes with an itemised invoice showing parts, labour and VAT.",
  "All work is covered by a 6-month / 6,000-mile parts-and-labour warranty.",
  "We fit OEM or OEM-equivalent parts unless you specifically ask otherwise.",
  "You're welcome to use the MOT viewing area and watch your test.",
  "Old parts are kept aside for you to see — nothing is replaced 'just in case'.",
];

const CAPABILITY = [
  { icon: MotIcon, title: "DVSA-approved", body: `Vehicle testing station ${CONTACT.motSiteNumber}, testing Class 4 vehicles on site.` },
  { icon: SpannerIcon, title: "Dealer-trained", body: "Technicians who came up through main dealers — without the main-dealer bill." },
  { icon: TyreIcon, title: "Fully equipped", body: "Two-post lifts, tyre and balancing machines and modern diagnostic kit." },
  { icon: ShieldPoundIcon, title: "Honest pricing", body: "A written estimate up front, and a phone call the moment anything changes." },
];

export default function AboutPage() {
  return (
    <main>
      {/* ── Intro with the actual shop ───────────────────────────────── */}
      <section className="border-b border-carbon-200 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <SectionHeading
              as="h1"
              eyebrow="About us"
              title={
                <>
                  The garage behind
                  <span className="text-brand-500"> the green sign</span>
                </>
              }
              intro="Marton Road MOT Centre is an independent, family-run workshop in the heart of Middlesbrough. We do the same work a main dealer does — MOTs, servicing, diagnostics, brakes and tyres — for people who'd rather deal with the person actually working on the car."
            />

            <p className="mt-5 max-w-xl leading-relaxed text-carbon-600">
              No commission-driven upsells and no jargon. If something needs
              doing we&apos;ll show you why; if it can safely wait, we&apos;ll
              tell you that too. That is the whole business model, and it is
              why most of our work now comes from people the last customer
              sent us.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="rounded-md bg-brand-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-carbon-950 shadow-lg shadow-brand-500/20 transition hover:bg-brand-400"
              >
                Book your visit
              </Link>
              <a
                href={CONTACT.phoneHref}
                className="rounded-md border border-carbon-300 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-carbon-800 transition hover:border-brand-500 hover:text-brand-700"
              >
                {CONTACT.phoneDisplay}
              </a>
            </div>
          </div>

          {/* The workshop itself */}
          <figure className="relative overflow-hidden rounded-3xl border border-carbon-200 shadow-2xl">
            <Image
              src="/images/brand/actual-shop.jpeg"
              alt="Marton Road MOT Centre at 416 Marton Road — the black-clad unit with its lime green signage and customer parking"
              width={1024}
              height={768}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon-950/90 via-carbon-950/60 to-transparent p-6 pt-20">
              <p className="font-display text-xl font-bold uppercase tracking-wide text-white">
                Our workshop on Marton Road
              </p>
              <p className="mt-1 text-sm text-carbon-300">
                {CONTACT.addressLine1}, {CONTACT.town} {CONTACT.postcode} — free
                customer parking on the forecourt
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="bg-carbon-950">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="border-l-2 border-brand-500 pl-4">
              <p className="font-display text-4xl font-extrabold text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-carbon-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What sets us apart ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          eyebrow="Why us"
          title="Main-dealer standards, independent prices"
          align="center"
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITY.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="rounded-2xl border border-carbon-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wide text-carbon-950">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-carbon-600">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Inside the garage ────────────────────────────────────────── */}
      <section className="border-y border-carbon-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <SectionHeading
            eyebrow="Inside the garage"
            title="Come in, have a brew, watch the test"
            intro="There's a proper waiting area with WiFi and a TV, and an MOT viewing window if you'd rather see the work for yourself."
            align="center"
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border border-carbon-200 shadow-sm">
              <Image
                src="/images/workshop/reception-logo-wall.jpg"
                alt="Our customer waiting area, with the M.R MOT shield on the wall and seating beneath the screen"
                width={1024}
                height={768}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="bg-white px-5 py-4 text-sm text-carbon-600">
                The customer waiting area — WiFi, seating and a screen.
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-carbon-200 shadow-sm">
              <Image
                src="/images/workshop/reception-desk.jpg"
                alt="Reception desk at Marton Road MOT Centre with the MOT viewing area sign"
                width={1024}
                height={768}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="bg-white px-5 py-4 text-sm text-carbon-600">
                Reception, and the MOT viewing area you&apos;re welcome to use.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── Our promise ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Our promise"
            title="Six things we always do"
            intro="Not a mission statement — just how the workshop runs, every day."
          />

          <ul className="space-y-4">
            {PROMISES.map((line) => (
              <li
                key={line}
                className="flex items-start gap-4 rounded-xl border border-carbon-200 bg-white p-4 shadow-sm"
              >
                <span
                  aria-hidden
                  className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-brand-500 text-carbon-950"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                    <path d="M8.2 13.6 5 10.4l1.3-1.3 1.9 1.9 5.5-5.5L15 6.8l-6.8 6.8Z" />
                  </svg>
                </span>
                <span className="text-carbon-700">{line}</span>
              </li>
            ))}
          </ul>
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
                "radial-gradient(circle at 12% 20%, rgba(125,194,66,0.22), transparent 55%)",
            }}
          />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-3xl font-extrabold uppercase text-white sm:text-4xl">
                Ready when you are
              </h2>
              <p className="mt-2 max-w-xl text-carbon-300">
                Book online in under 60 seconds — pick a service, choose a
                slot, and that&apos;s it. No deposit needed.
              </p>
            </div>
            <Link
              href="/book"
              className="rounded-md bg-brand-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-carbon-950 transition hover:bg-brand-400"
            >
              Book online →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
