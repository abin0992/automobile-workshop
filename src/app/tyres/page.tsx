import Link from "next/link";
import { formatPricePence } from "@/lib/format";

export const metadata = { title: "Tyres — Marton Road MOT Centre" };

type Tyre = {
  brand: string;
  model: string;
  size: string;
  season: "Summer" | "All-Season" | "Winter";
  loadSpeed: string;
  labels: { fuel: string; wet: string; noise: string };
  pricePence: number;
  stock: number;
};

const TYRES: Tyre[] = [
  {
    brand: "Michelin",
    model: "Primacy 4+",
    size: "205/55 R16",
    season: "Summer",
    loadSpeed: "91V",
    labels: { fuel: "B", wet: "A", noise: "69dB" },
    pricePence: 12800,
    stock: 8,
  },
  {
    brand: "Continental",
    model: "PremiumContact 6",
    size: "225/45 R17",
    season: "Summer",
    loadSpeed: "91Y",
    labels: { fuel: "B", wet: "A", noise: "71dB" },
    pricePence: 14200,
    stock: 6,
  },
  {
    brand: "Goodyear",
    model: "Vector 4Seasons Gen-3",
    size: "205/55 R16",
    season: "All-Season",
    loadSpeed: "94V",
    labels: { fuel: "C", wet: "B", noise: "69dB" },
    pricePence: 12500,
    stock: 12,
  },
  {
    brand: "Pirelli",
    model: "Cinturato P7",
    size: "225/50 R17",
    season: "Summer",
    loadSpeed: "94W",
    labels: { fuel: "B", wet: "A", noise: "71dB" },
    pricePence: 13900,
    stock: 4,
  },
  {
    brand: "Bridgestone",
    model: "Weather Control A005",
    size: "215/60 R16",
    season: "All-Season",
    loadSpeed: "99V",
    labels: { fuel: "C", wet: "A", noise: "72dB" },
    pricePence: 13100,
    stock: 5,
  },
  {
    brand: "Avon",
    model: "ZV7",
    size: "195/65 R15",
    season: "Summer",
    loadSpeed: "91H",
    labels: { fuel: "C", wet: "B", noise: "70dB" },
    pricePence: 8200,
    stock: 14,
  },
  {
    brand: "Nokian",
    model: "Snowproof P",
    size: "225/45 R17",
    season: "Winter",
    loadSpeed: "94V",
    labels: { fuel: "C", wet: "B", noise: "72dB" },
    pricePence: 13400,
    stock: 3,
  },
  {
    brand: "Falken",
    model: "Ziex ZE310",
    size: "205/55 R16",
    season: "Summer",
    loadSpeed: "91V",
    labels: { fuel: "C", wet: "B", noise: "70dB" },
    pricePence: 7900,
    stock: 10,
  },
];

export default function TyresPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-wider text-amber-600">
        Wheels &amp; Tyres
      </p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">
        Quality tyres, fitted while you wait.
      </h1>
      <p className="mt-3 max-w-2xl text-slate-700">
        We stock premium, mid-range and budget tyres from the brands you trust.
        Prices below are fully fitted — including new valve, balancing and old
        tyre disposal.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Fitting from
          </p>
          <p className="mt-1 text-2xl font-bold">£18</p>
          <p className="mt-1 text-xs text-slate-500">Per tyre, all-in</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Wheel balancing
          </p>
          <p className="mt-1 text-2xl font-bold">£12</p>
          <p className="mt-1 text-xs text-slate-500">Per wheel</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            4-wheel alignment
          </p>
          <p className="mt-1 text-2xl font-bold">£59</p>
          <p className="mt-1 text-xs text-slate-500">Laser accurate</p>
        </div>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-slate-950">In stock today</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Brand &amp; Model</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Season</th>
              <th className="px-4 py-3">Labels</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Fitted price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {TYRES.map((t) => (
              <tr key={`${t.brand}-${t.model}-${t.size}`} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{t.brand}</p>
                  <p className="text-xs text-slate-500">{t.model}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {t.size} <span className="text-slate-400">{t.loadSpeed}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      t.season === "Winter"
                        ? "rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700"
                        : t.season === "All-Season"
                        ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                        : "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
                    }
                  >
                    {t.season}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 text-xs">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5">
                      ⛽ {t.labels.fuel}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5">
                      💧 {t.labels.wet}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5">
                      🔊 {t.labels.noise}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs">
                  {t.stock > 6 ? (
                    <span className="text-emerald-600">In stock</span>
                  ) : t.stock > 2 ? (
                    <span className="text-amber-600">Low ({t.stock})</span>
                  ) : (
                    <span className="text-rose-600">Only {t.stock} left</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatPricePence(t.pricePence)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Can&apos;t see what you need? We can source most sizes within 24 hours.
        Call <a href="tel:+441642555019" className="underline">01642 555 019</a>.
      </p>

      <div className="mt-10 rounded-xl bg-slate-950 p-8 text-white">
        <h2 className="text-2xl font-bold">Need tyres fitting?</h2>
        <p className="mt-2 text-slate-300">
          Book any service and mention your tyre requirements in the notes —
          we&apos;ll have the right tyre ready when you arrive.
        </p>
        <Link
          href="/book"
          className="mt-5 inline-flex items-center rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
        >
          Book a slot →
        </Link>
      </div>
    </main>
  );
}
