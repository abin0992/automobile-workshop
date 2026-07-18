import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marton Road MOT Centre — MOT, Servicing & Tyres in Middlesbrough",
  description:
    "Independent car workshop on Marton Road, Middlesbrough. MOT tests, servicing, tyres and repairs. Book online in seconds.",
};

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services & Pricing" },
  { href: "/tyres", label: "Tyres" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400 text-slate-900 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M6.5 11.5 8 8h8l1.5 3.5H6.5Zm-2 5v2h2v-2h11v2h2v-2h1v-4.9L18.6 6.6A2 2 0 0 0 16.8 5H7.2a2 2 0 0 0-1.8 1.2L3.5 11.6V16.5h1Zm3-2a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm9 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
                </svg>
              </span>
              <span className="text-lg font-bold tracking-tight">
                Marton Road <span className="text-amber-600">MOT Centre</span>
              </span>
            </Link>

            <nav className="hidden md:block">
              <ul className="flex items-center gap-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Link
              href="/book"
              className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Book online
            </Link>
          </div>

          <nav className="md:hidden">
            <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block whitespace-nowrap rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {children}

        <footer className="mt-20 border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
            <div>
              <p className="text-base font-semibold">Marton Road MOT Centre</p>
              <p className="mt-2 text-sm text-slate-600">
                416 Marton Rd<br />
                Middlesbrough TS4 2PT<br />
                United Kingdom
              </p>
            </div>
            <div>
              <p className="text-base font-semibold">Opening hours</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>Mon – Fri: 08:00 – 18:00</li>
                <li>Saturday: 08:00 – 14:00</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
            <div>
              <p className="text-base font-semibold">Contact</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>01642 555 019</li>
                <li>bookings@martonroadmot.co.uk</li>
                <li>DVSA Approved · VAT GB 123 4567 89</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Marton Road MOT Centre Ltd.
          </div>
        </footer>
      </body>
    </html>
  );
}
