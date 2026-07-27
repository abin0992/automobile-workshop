import Link from "next/link";
import { CONTACT } from "@/lib/site";

/**
 * Fixed action bar for small screens.
 *
 * On a phone, the two things a customer wants from a garage site are "call
 * them" and "book a slot" — both otherwise require scrolling back to the
 * header. Hidden from `lg` upwards where the header actions are always
 * visible, and padded for the iOS home indicator.
 */
export default function CallRail() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-carbon-800 bg-carbon-950/95 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
        <a
          href={CONTACT.phoneHref}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-carbon-700 px-3 py-3 text-sm font-bold text-white transition hover:border-brand-500"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.5.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.57 3.5a1 1 0 0 1-.25 1l-2.2 2.3Z" />
          </svg>
          Call us
        </a>
        <Link
          href="/book"
          className="inline-flex items-center justify-center rounded-md bg-brand-500 px-3 py-3 text-sm font-bold uppercase tracking-wide text-carbon-950 transition hover:bg-brand-400"
        >
          Book online
        </Link>
      </div>
    </div>
  );
}
