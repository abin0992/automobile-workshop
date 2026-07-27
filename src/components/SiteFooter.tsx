import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/site";

const SERVICE_LINKS = [
  { href: "/services", label: "MOT testing" },
  { href: "/services", label: "Servicing & diagnostics" },
  { href: "/tyres", label: "Tyres & wheel balancing" },
  { href: "/services", label: "Brakes & suspension" },
  { href: "/services", label: "Air-con recharge" },
  { href: "/services", label: "Exhausts & batteries" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-carbon-950 text-carbon-300">
      {/* Lime rule — the same accent as the fascia lettering */}
      <div className="h-1 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Image
            src="/images/brand/logo.svg"
            alt="Marton Road MOT Centre"
            width={1536}
            height={1024}
            unoptimized
            className="h-24 w-auto"
          />
          <p className="mt-4 text-sm leading-relaxed">
            An independent, family-run garage on Marton Road — honest advice,
            fixed prices and work you can actually see being done.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-carbon-800 bg-carbon-900 px-3 py-1.5 text-xs font-semibold text-brand-400">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            DVSA station {CONTACT.motSiteNumber}
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
            Visit the workshop
          </h2>
          <address className="mt-4 not-italic text-sm leading-relaxed">
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
            className="mt-3 inline-flex text-sm font-semibold text-brand-400 underline-offset-4 hover:underline"
          >
            Get directions →
          </a>
          <ul className="mt-5 space-y-1.5 text-sm">
            <li>
              <a
                href={CONTACT.phoneHref}
                className="font-semibold text-white transition hover:text-brand-400"
              >
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.bookingsEmail}`}
                className="transition hover:text-brand-400"
              >
                {CONTACT.bookingsEmail}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
            What we do
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {SERVICE_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition hover:text-brand-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
            Opening hours
          </h2>
          <ul className="mt-4 space-y-1.5 text-sm">
            {CONTACT.hours.map(([day, hours]) => (
              <li key={day} className="flex justify-between gap-4">
                <span>{day}</span>
                <span
                  className={
                    hours === "Closed"
                      ? "text-carbon-500"
                      : "font-medium text-white"
                  }
                >
                  {hours}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/book"
            className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-brand-500 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-carbon-950 transition hover:bg-brand-400"
          >
            Book online
          </Link>
        </div>
      </div>

      <div className="border-t border-carbon-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-carbon-400 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {CONTACT.legalName}. All rights
            reserved.
          </p>
          <p>DVSA approved · Class 4 MOT · VAT GB 123 4567 89</p>
        </div>
      </div>
    </footer>
  );
}
