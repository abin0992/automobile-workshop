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
      <div className="mt-8 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search services</span>
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          >
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. brakes, air-con, MOT…"
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={
                (category === c
                  ? "bg-slate-900 text-white "
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 ") +
                "rounded-full px-3 py-1.5 text-xs font-medium transition"
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Showing {filtered.length} of {services.length} services
      </p>

      {grouped.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-600">
            No services matched your search. Try a different keyword.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {grouped.map(([cat, items]) => (
            <section key={cat}>
              <h2 className="text-lg font-semibold text-slate-900">{cat}</h2>
              <div className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {items.map((s) => (
                  <div
                    key={s.slug}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-slate-950">
                        {s.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {s.description}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Approx. {formatDuration(s.durationMinutes)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                      <p className="text-xl font-bold text-slate-950">
                        {s.priceGbp === 0
                          ? "FREE"
                          : `from ${formatPricePence(s.priceGbp)}`}
                      </p>
                      <Link
                        href={`/book?service=${s.slug}`}
                        className="rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
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
