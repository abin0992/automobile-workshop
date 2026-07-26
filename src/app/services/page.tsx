import { db } from "@/db";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";
import ServicesCatalog from "./ServicesCatalog";
import { ensureSeeded } from "@/lib/seed";
import DatabaseNotice from "@/components/DatabaseNotice";

export const dynamic = "force-dynamic";

export const metadata = { title: "Services & Pricing — Marton Road MOT Centre" };

type ServiceRow = typeof services.$inferSelect;

async function loadServices(): Promise<ServiceRow[] | null> {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(services)
      .orderBy(asc(services.category), asc(services.name));
  } catch (error) {
    console.error("[services] could not load services:", error);
    return null;
  }
}

export default async function ServicesPage() {
  const rows = await loadServices();

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

      {rows === null ? (
        <div className="mt-8">
          <DatabaseNotice title="Our price list is temporarily unavailable" />
        </div>
      ) : (
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
      )}
    </main>
  );
}
