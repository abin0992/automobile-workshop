import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { CONTACT } from "@/lib/site";

export const metadata = {
  title: "Contact us",
  description: `Marton Road MOT Centre, ${CONTACT.addressLine1}, ${CONTACT.town} ${CONTACT.postcode}. Call ${CONTACT.phoneDisplay} or book online.`,
};

function PinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

function PhoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.5.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.57 3.5a1 1 0 0 1-.25 1l-2.2 2.3Z" />
    </svg>
  );
}

function MailIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}

const CONTACT_CARDS = [
  {
    icon: PhoneIcon,
    label: "Call the workshop",
    value: CONTACT.phoneDisplay,
    href: CONTACT.phoneHref,
    note: "Fastest for same-day availability",
  },
  {
    icon: PhoneIcon,
    label: "Tyre & parts enquiries",
    value: CONTACT.mobileDisplay,
    href: CONTACT.mobileHref,
    note: "Sizes, stock and prices",
  },
  {
    icon: MailIcon,
    label: "Bookings by email",
    value: CONTACT.bookingsEmail,
    href: `mailto:${CONTACT.bookingsEmail}`,
    note: "We reply the same working day",
  },
  {
    icon: MailIcon,
    label: "General enquiries",
    value: CONTACT.generalEmail,
    href: `mailto:${CONTACT.generalEmail}`,
    note: "Anything else at all",
  },
];

export default function ContactPage() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    timeZone: "Europe/London",
  });

  return (
    <main>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <section className="border-b border-carbon-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionHeading
            as="h1"
            eyebrow="Get in touch"
            title={
              <>
                Talk to the people
                <span className="text-brand-500"> doing the work</span>
              </>
            }
            intro="For bookings, the online form is quickest and confirms instantly. For anything else — a quote, a second opinion, a warning light you're unsure about — just call. You'll get a technician, not a call centre."
          />
        </div>
      </section>

      {/* ── Contact cards ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map(({ icon: Icon, label, value, href, note }) => (
            <li key={label}>
              <a
                href={href}
                className="group flex h-full flex-col rounded-2xl border border-carbon-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-400 hover:shadow-lg"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-carbon-950 text-brand-500 transition group-hover:bg-brand-500 group-hover:text-carbon-950">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-carbon-500">
                  {label}
                </p>
                <p className="mt-1.5 break-words font-display text-xl font-bold text-carbon-950 group-hover:text-brand-700">
                  {value}
                </p>
                <p className="mt-auto pt-3 text-xs text-carbon-500">{note}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Where to find us — with the actual shop ──────────────────── */}
      <section className="border-y border-carbon-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <figure className="overflow-hidden rounded-3xl border border-carbon-200 shadow-xl">
              <Image
                src="/images/brand/actual-shop.jpeg"
                alt="Marton Road MOT Centre — the black unit with lime green signage at 416 Marton Road, Middlesbrough"
                width={1024}
                height={768}
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-full w-full object-cover"
              />
              <figcaption className="bg-carbon-950 px-6 py-5">
                <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
                  This is us — look for the green sign
                </p>
                <p className="mt-1 text-sm text-carbon-400">
                  Reception is the door in the centre of the unit. Pull straight
                  onto the forecourt; parking is free while you wait.
                </p>
              </figcaption>
            </figure>

            <div>
              <SectionHeading eyebrow="Where to find us" title="416 Marton Road" />

              <div className="mt-8 rounded-2xl border border-carbon-200 bg-carbon-50/70 p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-brand-500 text-carbon-950">
                    <PinIcon />
                  </span>
                  <div>
                    <address className="not-italic leading-relaxed text-carbon-800">
                      <strong className="block font-semibold text-carbon-950">
                        {CONTACT.name}
                      </strong>
                      {CONTACT.addressLine1}
                      <br />
                      {CONTACT.town} {CONTACT.postcode}
                      <br />
                      {CONTACT.country}
                    </address>
                    <a
                      href={CONTACT.mapsUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-3 inline-flex text-sm font-bold uppercase tracking-wide text-brand-700 underline-offset-4 hover:underline"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>

                <dl className="mt-6 grid gap-4 border-t border-carbon-200 pt-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.16em] text-carbon-500">
                      DVSA station
                    </dt>
                    <dd className="mt-1 font-medium text-carbon-900">
                      {CONTACT.motSiteNumber}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.16em] text-carbon-500">
                      Parking
                    </dt>
                    <dd className="mt-1 font-medium text-carbon-900">
                      Free, on the forecourt
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Opening hours, with today highlighted */}
              <div className="mt-6 rounded-2xl border border-carbon-200 bg-white p-6 shadow-sm">
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-carbon-950">
                  Opening hours
                </h2>
                <ul className="mt-4 divide-y divide-carbon-100 text-sm">
                  {CONTACT.hours.map(([day, hours]) => {
                    const isToday = day === today;
                    return (
                      <li
                        key={day}
                        className={`flex items-center justify-between gap-4 px-2 py-2.5 ${
                          isToday ? "-mx-2 rounded-lg bg-brand-50" : ""
                        }`}
                      >
                        <span
                          className={
                            isToday
                              ? "font-bold text-carbon-950"
                              : "text-carbon-600"
                          }
                        >
                          {day}
                          {isToday && (
                            <span className="ml-2 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-carbon-950">
                              Today
                            </span>
                          )}
                        </span>
                        <span
                          className={
                            hours === "Closed"
                              ? "text-carbon-400"
                              : "font-semibold text-carbon-900"
                          }
                        >
                          {hours}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 text-xs text-carbon-500">
                  Bank holidays: closed. Christmas hours are announced in
                  December.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Directions"
          title="Five minutes from James Cook Hospital"
          intro="We're on the main Marton Road route south out of the town centre, close to Longlands. The number 36 and 63 buses stop a short walk away."
        />

        <div className="mt-8 overflow-hidden rounded-3xl border border-carbon-200 shadow-lg">
          <iframe
            src={CONTACT.mapsEmbedUrl}
            title={`Map showing ${CONTACT.name} at ${CONTACT.addressLine1}, ${CONTACT.town}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-[420px] w-full border-0"
          />
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
                "radial-gradient(circle at 85% 25%, rgba(125,194,66,0.2), transparent 55%)",
            }}
          />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-3xl font-extrabold uppercase text-white sm:text-4xl">
                Rather just book it?
              </h2>
              <p className="mt-2 max-w-xl text-carbon-300">
                Choose a service and a slot online — instant confirmation, no
                deposit, and you can change it with a phone call.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/book"
                className="rounded-md bg-brand-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-carbon-950 transition hover:bg-brand-400"
              >
                Book online
              </Link>
              <a
                href={CONTACT.phoneHref}
                className="rounded-md border border-white/25 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:border-brand-500 hover:bg-white/5"
              >
                Call us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
