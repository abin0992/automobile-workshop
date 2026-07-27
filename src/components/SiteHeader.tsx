"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CONTACT } from "@/lib/site";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services & Pricing" },
  { href: "/tyres", label: "Tyres" },
  { href: "/contact", label: "Contact" },
];

/**
 * Sticky header. Renders the workshop's actual shield logo rather than a
 * drawn substitute, on the same near-black cladding colour as the building
 * itself, so the site and the shopfront read as one brand.
 */
export default function SiteHeader() {
  const pathname = usePathname();

  /**
   * The drawer must close whenever the route changes, but the layout persists
   * across navigations so the component never remounts. Rather than closing
   * it from an effect — which costs an extra render pass on every navigation
   * — the open state is stored alongside the path it was opened on, and is
   * treated as closed as soon as the current path differs. Deriving it this
   * way means the correct state is available on the very first render.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  const toggle = () => setOpenedOn((prev) => (prev === pathname ? null : pathname));

  // Prevent the page scrolling behind the open drawer.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar — phone number is the highest-intent action for a garage */}
      <div className="hidden bg-carbon-950 text-carbon-300 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 text-xs sm:px-6">
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
            DVSA-approved MOT station · {CONTACT.addressLine1},{" "}
            {CONTACT.town} {CONTACT.postcode}
          </p>
          <p className="flex items-center gap-4">
            <span>{CONTACT.hoursShort}</span>
            <a
              href={CONTACT.phoneHref}
              className="font-semibold text-white transition hover:text-brand-400"
            >
              {CONTACT.phoneDisplay}
            </a>
          </p>
        </div>
      </div>

      <div className="border-b border-carbon-800 bg-carbon-950/95 backdrop-blur supports-[backdrop-filter]:bg-carbon-950/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
            aria-label="Marton Road MOT Centre — home"
          >
            {/*
              The full shield lockup, as vector artwork. It already contains
              the "Marton Road MOT Centre" strapline, so no wordmark is set
              beside it — repeating the name would be redundant. Being SVG it
              stays sharp on high-density displays at any height.

              `unoptimized` because Next's image optimiser rasterises SVGs,
              which would throw away the resolution independence that is the
              whole reason for using one. The file is ~6.6 KB gzipped, far
              smaller than any raster it would produce.
            */}
            <Image
              src="/images/brand/logo.svg"
              alt="Marton Road MOT Centre"
              width={1536}
              height={1024}
              priority
              unoptimized
              className="h-14 w-auto sm:h-[4.5rem]"
            />
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative rounded-md px-3 py-2 text-sm font-semibold transition ${
                        active
                          ? "text-white"
                          : "text-carbon-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.label}
                      {active && (
                        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-500" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={CONTACT.phoneHref}
              className="hidden items-center gap-2 rounded-md border border-carbon-700 px-3 py-2 text-sm font-semibold text-white transition hover:border-brand-500 hover:text-brand-400 sm:inline-flex lg:hidden xl:inline-flex"
            >
              <PhoneIcon className="h-4 w-4" />
              <span className="hidden xl:inline">{CONTACT.phoneDisplay}</span>
              <span className="xl:hidden">Call</span>
            </a>
            <Link
              href="/book"
              className="inline-flex items-center rounded-md bg-brand-500 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-carbon-950 shadow-lg shadow-brand-500/20 transition hover:bg-brand-400"
            >
              Book now
            </Link>

            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-md border border-carbon-700 text-white transition hover:border-brand-500 lg:hidden"
            >
              {open ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-b border-carbon-800 bg-carbon-950 lg:hidden"
      >
        <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between border-b border-carbon-900 py-3 text-base font-semibold transition ${
                    active ? "text-brand-400" : "text-carbon-200 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span aria-hidden className="text-carbon-600">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="py-3">
            <a
              href={CONTACT.phoneHref}
              className="flex items-center justify-center gap-2 rounded-md border border-carbon-700 px-4 py-3 text-sm font-bold text-white"
            >
              <PhoneIcon className="h-4 w-4" />
              {CONTACT.phoneDisplay}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.5.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.57 3.5a1 1 0 0 1-.25 1l-2.2 2.3Z" />
    </svg>
  );
}
