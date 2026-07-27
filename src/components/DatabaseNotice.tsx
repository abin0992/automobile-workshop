/**
 * Shown in place of database-backed content when the database is unreachable,
 * so a connection problem degrades one section instead of returning an opaque
 * "server error" for the whole page.
 */
import { CONTACT } from "@/lib/site";

export default function DatabaseNotice({
  title = "Live pricing is temporarily unavailable",
  /**
   * What the visitor was trying to do. The booking page reuses this notice,
   * where "our price list can't be loaded" would be the wrong explanation.
   */
  body = "Our price list can't be loaded at the moment.",
  action = "and we'll gladly quote you over the phone",
}: {
  title?: string;
  body?: string;
  action?: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-300 bg-brand-50 p-6 text-sm text-carbon-800">
      <p className="font-display text-lg font-bold uppercase tracking-wide text-carbon-950">
        {title}
      </p>
      <p className="mt-2">
        {body} Everything else on the site is up to date — please call{" "}
        <a
          href={CONTACT.phoneHref}
          className="font-bold text-brand-700 underline underline-offset-4"
        >
          {CONTACT.phoneDisplay}
        </a>{" "}
        {action}.
      </p>
      <p className="mt-3 text-xs text-carbon-600">
        Site administrator: check <code className="font-mono">/api/health</code>{" "}
        for a diagnosis.
      </p>
    </div>
  );
}
