import { db } from "@/db";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";
import ServicesCatalog from "./ServicesCatalog";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export const metadata = { title: "Services & Pricing — Marton Road MOT Centre" };

export default async function ServicesPage() {
  await ensureSeeded();
  const rows = await db.select().from(services).orderBy(asc(services.category), asc(services.name));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-wider text-amber-600">
        Services &amp; Pricing
      </p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">
        Everything we do — with the price up front.
      </h1>
      <p className="mt-3 max-w-2xl text-slate-700">
        All prices include parts, labour and VAT. Some jobs vary by vehicle —
        we&apos;ll always give you a firm quote before starting work.
      </p>

      <ServicesCatalog
        services={rows.map((r) => ({
          slug: r.slug,
          name: r.name,
          category: r.category,
          description: r.description,
          priceGbp: r.priceGbp,
          durationMinutes: r.durationMinutes,
          bookable: r.bookable,
        }))}
      />
    </main>
  );
}
