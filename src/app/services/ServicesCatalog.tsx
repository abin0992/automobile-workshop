"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPricePence, formatDuration } from "@/lib/format";

type Item = {
  slug: string;
  name: string;
  category: string;
  description: string;
  priceGbp: number;
  durationMinutes: number;
  bookable: boolean;
};

export default function ServicesCatalog({ services }: { services: Item[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => set.add(s.category));
    return ["All", ...Array.from(set).sort()];
  }, [services]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      if (category !== "All" && s.category !== category) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    });
  }, [services, query, category]);

  const grouped = useMemo(() => {
    const m = new Map<string, Item[]>();
    for (const s of filtered) {
      const list = m.get(s.category) ?? [];
      list.push(s);
      m.set(s.category, list);
    }
    return Array.from(m.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <>
      <div className="flex flex-col gap-3 rounded-2xl border border-carbon-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search services</span>
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-carbon-400"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. brakes, air-con, MOT…"
            className="w-full rounded-md border border-carbon-300 bg-white py-2.5 pl-10 pr-3 text-sm text-carbon-900 placeholder-carbon-400 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={
                (category === c
                  ? "bg-carbon-950 text-white "
                  : "bg-carbon-100 text-carbon-700 hover:bg-carbon-200 ") +
                "rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition"
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs font-medium text-carbon-500">
        Showing {filtered.length} of {services.length} services
      </p>

      {grouped.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-carbon-300 bg-white p-10 text-center">
          <p className="text-carbon-600">
            No services matched your search. Try a different keyword.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {grouped.map(([cat, items]) => (
            <section key={cat}>
              <h2 className="flex items-center gap-3 font-display text-xl font-bold uppercase tracking-wide text-carbon-950">
                <span aria-hidden className="h-5 w-1 rounded-full bg-brand-500" />
                {cat}
                <span className="text-sm font-semibold text-carbon-400">
                  ({items.length})
                </span>
              </h2>
              <div className="mt-3 divide-y divide-carbon-100 overflow-hidden rounded-2xl border border-carbon-200 bg-white shadow-sm">
                {items.map((s) => (
                  <div
                    key={s.slug}
                    className="flex flex-col gap-3 p-5 transition hover:bg-brand-50/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-carbon-950">
                        {s.name}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-carbon-600">
                        {s.description}
                      </p>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-carbon-500">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5.2l3.2 2" strokeLinecap="round" />
                        </svg>
                        Approx. {formatDuration(s.durationMinutes)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                      <p className="font-display text-2xl font-extrabold text-carbon-950">
                        {s.priceGbp === 0
                          ? "FREE"
                          : `from ${formatPricePence(s.priceGbp)}`}
                      </p>
                      <Link
                        href={`/book?service=${s.slug}`}
                        className="rounded-md bg-carbon-950 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-500 hover:text-carbon-950"
                      >
                        Book →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
