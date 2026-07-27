import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { bookings, services } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import {
  formatDateLong,
  formatDuration,
  formatPricePence,
  formatTimeShort,
} from "@/lib/format";
import UpsellForm from "./UpsellForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  return { title: `Booking ${reference} — Marton Road MOT Centre` };
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const rows = await db
    .select()
    .from(bookings)
    .where(eq(bookings.reference, reference))
    .limit(1);
  if (rows.length === 0) return notFound();
  const bk = rows[0];

  const svcSlugs = [bk.serviceSlug];
  if (bk.addonSlug) svcSlugs.push(bk.addonSlug);
  // We may also want interim + full for upsell UI
  const wanted = Array.from(
    new Set([...svcSlugs, "interim-service", "full-service", "mot-test"])
  );
  const svcRows = await db
    .select()
    .from(services)
    .where(inArray(services.slug, wanted));
  const svcMap = new Map(svcRows.map((s) => [s.slug, s]));

  const svc = svcMap.get(bk.serviceSlug);
  const addon = bk.addonSlug ? svcMap.get(bk.addonSlug) : null;
  const interimSvc = svcMap.get("interim-service");
  const fullSvc = svcMap.get("full-service");

  const total =
    (svc?.priceGbp ?? 0) + (addon?.priceGbp ?? 0);

  const canUpsell = bk.serviceSlug === "mot-test" && bk.status === "confirmed";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="grid h-10 w-10 flex-none place-items-center rounded-full bg-emerald-500 text-white"
          >
            ✓
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Booking confirmed
            </p>
            <h1 className="mt-1 text-2xl font-bold text-emerald-950">
              You&apos;re booked in, {bk.customerName.split(" ")[0]}.
            </h1>
            <p className="mt-1 text-sm text-emerald-900/80">
              We&apos;ve sent a confirmation email to{" "}
              <span className="font-medium">{bk.email}</span>. Please arrive 5
              minutes before your slot.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-carbon-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-carbon-500">
              Reference
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-carbon-950">
              {bk.reference}
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            {bk.status}
          </span>
        </div>

        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-carbon-500">
              When
            </dt>
            <dd className="mt-1 text-base font-semibold text-carbon-900">
              {formatDateLong(bk.bookingDate)}
            </dd>
            <dd className="text-sm text-carbon-600">
              at {formatTimeShort(bk.timeSlot)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-carbon-500">
              Where
            </dt>
            <dd className="mt-1 text-base font-semibold text-carbon-900">
              Marton Road MOT Centre
            </dd>
            <dd className="text-sm text-carbon-600">
              416 Marton Rd, Middlesbrough TS4 2PT
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-carbon-500">
              Vehicle
            </dt>
            <dd className="mt-1 text-base font-semibold text-carbon-900">
              {bk.vehicleReg}
            </dd>
            <dd className="text-sm text-carbon-600">{bk.vehicleDetails}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-carbon-500">
              Contact
            </dt>
            <dd className="mt-1 text-base font-semibold text-carbon-900">
              {bk.customerName}
            </dd>
            <dd className="text-sm text-carbon-600">
              {bk.phone} · {bk.email}
            </dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-carbon-100 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-carbon-500">
            Work booked
          </p>
          <ul className="mt-3 divide-y divide-carbon-100">
            {svc && (
              <li className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-carbon-900">{svc.name}</p>
                  <p className="text-xs text-carbon-500">
                    Approx. {formatDuration(svc.durationMinutes)}
                  </p>
                </div>
                <p className="font-semibold">{formatPricePence(svc.priceGbp)}</p>
              </li>
            )}
            {addon && (
              <li className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-carbon-900">
                    {addon.name}
                    <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                      Add-on
                    </span>
                  </p>
                  <p className="text-xs text-carbon-500">
                    Approx. {formatDuration(addon.durationMinutes)}
                  </p>
                </div>
                <p className="font-semibold">
                  +{formatPricePence(addon.priceGbp)}
                </p>
              </li>
            )}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-carbon-100 pt-4">
            <span className="text-sm font-semibold text-carbon-500">
              Estimated total
            </span>
            <span className="text-2xl font-bold text-carbon-950">
              {formatPricePence(total)}
            </span>
          </div>
          {bk.notes && (
            <div className="mt-4 rounded-md bg-carbon-50 p-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-carbon-500">
                Your notes
              </p>
              <p className="mt-1 text-carbon-700">{bk.notes}</p>
            </div>
          )}
        </div>
      </section>

      {/* MOT upsell zone */}
      {canUpsell && interimSvc && fullSvc && (
        <section className="mt-6 rounded-2xl border border-brand-400 bg-gradient-to-br from-brand-50 to-white p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden>
              💡
            </span>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-brand-950">
                While your car is here…
              </h2>
              <p className="mt-1 text-sm text-brand-800/80">
                Add a service to your MOT visit and we&apos;ll take care of both
                in a single trip. You can change or remove this any time before
                your slot.
              </p>
              <UpsellForm
                reference={bk.reference}
                currentAddon={bk.addonSlug ?? ""}
                options={[
                  {
                    slug: "interim-service",
                    name: interimSvc.name,
                    description: interimSvc.description,
                    priceGbp: interimSvc.priceGbp,
                  },
                  {
                    slug: "full-service",
                    name: fullSvc.name,
                    description: fullSvc.description,
                    priceGbp: fullSvc.priceGbp,
                  },
                ]}
              />
            </div>
          </div>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-md border border-carbon-300 px-4 py-2.5 text-sm font-semibold text-carbon-700 hover:bg-carbon-100"
        >
          Back to home
        </Link>
        <Link
          href="/services"
          className="rounded-md border border-carbon-300 px-4 py-2.5 text-sm font-semibold text-carbon-700 hover:bg-carbon-100"
        >
          See all services
        </Link>
      </div>
    </main>
  );
}
