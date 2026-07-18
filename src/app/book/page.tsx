import { db } from "@/db";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getNext60Days } from "@/lib/availability";
import { ensureSeeded } from "@/lib/seed";
import BookingForm from "./BookingForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Book online — Marton Road MOT Centre" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await ensureSeeded();
  const sp = await searchParams;
  const preSelectRaw = sp.service;
  const preSelect = Array.isArray(preSelectRaw) ? preSelectRaw[0] : preSelectRaw;

  const rows = await db
    .select()
    .from(services)
    .orderBy(asc(services.category), asc(services.name));

  const bookable = rows.map((s) => ({
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
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-wider text-amber-600">
        Online booking
      </p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">Book your visit</h1>
      <p className="mt-3 max-w-2xl text-slate-700">
        Pick a service and a time that suits you. Confirmation is instant — no
        deposit required.
      </p>

      <BookingForm
        services={bookable}
        days={days}
        initialServiceSlug={initialService}
        hasPreSelection={isPreSelected}
      />
    </main>
  );
}
