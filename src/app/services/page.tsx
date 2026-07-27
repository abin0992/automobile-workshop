import Link from "next/link";
import { db } from "@/db";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";
import ServicesCatalog from "./ServicesCatalog";
import { ensureSeeded } from "@/lib/seed";
import DatabaseNotice from "@/components/DatabaseNotice";
import SectionHeading from "@/components/SectionHeading";
import { CONTACT } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services & pricing",
  description:
    "Every job we do, with the price up front — MOTs, servicing, brakes, diagnostics, air-con and tyres. All prices include parts, labour and VAT.",
};

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
    <main>
      <section className="border-b border-carbon-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionHeading
            as="h1"
            eyebrow="Services & pricing"
            title={
              <>
                Everything we do —
                <span className="text-brand-500"> price up front</span>
              </>
            }
            intro="All prices include parts, labour and VAT. Some jobs vary by vehicle, so where a price is a starting point we'll confirm a firm quote before any work begins."
          />

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="rounded-md bg-brand-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-carbon-950 shadow-lg shadow-brand-500/20 transition hover:bg-brand-400"
            >
              Book a slot
            </Link>
            <a
              href={CONTACT.phoneHref}
              className="rounded-md border border-carbon-300 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-carbon-800 transition hover:border-brand-500 hover:text-brand-700"
            >
              Ask for a quote — {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {rows === null ? (
          <DatabaseNotice title="Our price list is temporarily unavailable" />
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
      </div>

      {/* Reassurance strip */}
      <section className="border-y border-carbon-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
          {[
            ["Written estimate first", "You approve the price before we start. If the job changes, we ring you."],
            ["12-month warranty", "Parts and labour, 12 months or 12,000 miles, whichever comes first."],
            ["No hidden extras", "Prices include VAT, disposal and consumables. What we quote is what you pay."],
          ].map(([title, body]) => (
            <div key={title}>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-carbon-950">
                {title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-carbon-600">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
