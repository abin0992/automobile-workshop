/**
 * Shown in place of database-backed content when the database is unreachable,
 * so a connection problem degrades one section instead of returning an opaque
 * "server error" for the whole page.
 */
export default function DatabaseNotice({
  title = "Live pricing is temporarily unavailable",
}: {
  title?: string;
}) {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
      <p className="font-semibold">{title}</p>
      <p className="mt-2">
        Our price list can&apos;t be loaded at the moment. Everything else on
        the site is up to date — please call{" "}
        <a href="tel:+447454293416" className="font-semibold underline underline-offset-4">
          07454 293416
        </a>{" "}
        and we&apos;ll gladly quote you over the phone.
      </p>
      <p className="mt-3 text-xs text-amber-800">
        Site administrator: check <code className="font-mono">/api/health</code>{" "}
        for a diagnosis.
      </p>
    </div>
  );
}
