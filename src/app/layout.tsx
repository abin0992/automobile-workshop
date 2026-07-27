import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CallRail from "@/components/CallRail";
import { CONTACT, FULL_ADDRESS } from "@/lib/site";

/**
 * Fonts are self-hosted through Fontsource rather than fetched from Google
 * Fonts at build time. Barlow Condensed is the closest widely-available match
 * to the tall, condensed lettering on the workshop's fascia and shield logo,
 * so headings echo the signage; Inter carries body copy, where legibility
 * matters more than character.
 *
 * Self-hosting also means no build-time network dependency and no third-party
 * request from the visitor's browser.
 */
import "@fontsource-variable/inter";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.martonroadmot.co.uk"),
  title: {
    default: `${CONTACT.name} — MOT, Servicing & Tyres in Middlesbrough`,
    template: `%s — ${CONTACT.name}`,
  },
  description:
    "Independent DVSA-approved garage on Marton Road, Middlesbrough. MOT tests, servicing, diagnostics, brakes and tyres at fixed, upfront prices. Book online in seconds.",
  keywords: [
    "MOT Middlesbrough",
    "car service Middlesbrough",
    "tyres Middlesbrough",
    "garage TS4",
    "Marton Road MOT Centre",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: CONTACT.name,
    title: `${CONTACT.name} — MOT, Servicing & Tyres in Middlesbrough`,
    description:
      "Independent DVSA-approved garage on Marton Road, Middlesbrough. Fixed prices, 6-month warranty, book online.",
    images: [{ url: "/images/workshop/shopfront-wide.jpg", width: 1600, height: 1200, alt: `${CONTACT.name} on Marton Road` }],
  },
  icons: {
    apple: "/images/brand/apple-icon.png",
  },
};

/** Local-business structured data, so search engines show hours and location. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: CONTACT.name,
  legalName: CONTACT.legalName,
  image: "https://www.martonroadmot.co.uk/images/workshop/shopfront-wide.jpg",
  logo: "https://www.martonroadmot.co.uk/images/brand/logo-mark.png",
  telephone: CONTACT.phoneDisplay,
  email: CONTACT.bookingsEmail,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.addressLine1,
    addressLocality: CONTACT.town,
    postalCode: CONTACT.postcode,
    addressCountry: "GB",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: CONTACT.latitude,
    longitude: CONTACT.longitude,
  },
  url: "https://www.martonroadmot.co.uk",
  priceRange: "££",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "14:00",
    },
  ],
  areaServed: { "@type": "City", name: CONTACT.town },
  description: `Independent DVSA-approved MOT and service centre at ${FULL_ADDRESS}.`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen font-sans text-carbon-900 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-brand-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-carbon-950"
        >
          Skip to content
        </a>

        <SiteHeader />

        <div id="main">{children}</div>

        <SiteFooter />

        {/* Breathing room so the fixed mobile bar never covers the footer. */}
        <div aria-hidden className="h-16 lg:hidden" />
        <CallRail />

        <script
          type="application/ld+json"
          // Static, developer-authored object — no user input is interpolated.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </body>
    </html>
  );
}
