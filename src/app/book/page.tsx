import { db } from "@/db";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getNext60Days } from "@/lib/availability";
import { ensureSeeded } from "@/lib/seed";
import BookingForm from "./BookingForm";
import DatabaseNotice from "@/components/DatabaseNotice";

export const dynamic = "force-dynamic";

export const metadata = { title: "Book online — Marton Road MOT Centre" };

type ServiceRow = typeof services.$inferSelect;

/**
 * Mirrors the handling on /services: a database problem degrades this page
 * instead of returning an opaque 500. Losing the booking form is bad enough
 * without also hiding the phone number from someone trying to reach us.
 */
async function loadServices(): Promise<ServiceRow[] | null> {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(services)
      .orderBy(asc(services.category), asc(services.name));
  } catch (error) {
    console.error("[book] could not load services:", error);
    return null;
  }
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const preSelectRaw = sp.service;
  const preSelect = Array.isArray(preSelectRaw) ? preSelectRaw[0] : preSelectRaw;

  const rows = await loadServices();

  const bookable = (rows ?? []).map((s) => ({
    slug: s.slug,
    name: s.name,
    category: s.category,
    description: s.description,
    priceGbp: s.priceGbp,
    durationMinutes: s.durationMinutes,
  }));

  const days = getNext60Days();

  const isPreSelected = Boolean(
    preSelect && bookable.some((b) => b.slug === preSelect)
  );
  const initialService = isPreSelected ? (preSelect as string) : "mot-test";

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
        <span aria-hidden className="h-px w-7 bg-brand-500" />
        Online booking
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-carbon-950 sm:text-5xl">
        Book your visit
      </h1>
      <p className="mt-3 max-w-2xl text-carbon-600">
        Pick a service and a time that suits you. Confirmation is instant — no
        deposit required.
      </p>

      {rows === null ? (
        <div className="mt-8">
          <DatabaseNotice
            title="Online booking is temporarily unavailable"
            body="We can't load the booking calendar at the moment."
            action="and we'll book you in over the phone"
          />
        </div>
      ) : (
        <BookingForm
          services={bookable}
          days={days}
          initialServiceSlug={initialService}
          hasPreSelection={isPreSelected}
        />
      )}
    </main>
  );
}
