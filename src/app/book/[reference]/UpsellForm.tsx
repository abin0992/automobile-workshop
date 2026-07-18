"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPricePence } from "@/lib/format";

type Option = {
  slug: "interim-service" | "full-service";
  name: string;
  description: string;
  priceGbp: number;
};

export default function UpsellForm({
  reference,
  currentAddon,
  options,
}: {
  reference: string;
  currentAddon: string;
  options: Option[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(currentAddon);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty = selected !== currentAddon;

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/bookings/${reference}/upsell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addonSlug: selected || null }),
      });
      const data = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not update your booking.");
        return;
      }
      setMessage(
        selected
          ? "Add-on saved. See you soon!"
          : "Add-on removed."
      );
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <label
        className={
          (selected === ""
            ? "border-amber-500 ring-2 ring-amber-500/20 "
            : "border-transparent hover:border-amber-400 ") +
          "flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 transition"
        }
      >
        <input
          type="radio"
          name={`upsell-${reference}`}
          checked={selected === ""}
          onChange={() => setSelected("")}
          className="h-4 w-4 accent-amber-600"
        />
        <span className="flex-1">
          <span className="block text-sm font-semibold text-slate-900">
            Just the MOT
          </span>
          <span className="block text-xs text-slate-500">
            No add-on service.
          </span>
        </span>
        <span className="text-sm font-semibold text-slate-900">—</span>
      </label>

      {options.map((opt) => (
        <label
          key={opt.slug}
          className={
            (selected === opt.slug
              ? "border-amber-500 ring-2 ring-amber-500/20 "
              : "border-transparent hover:border-amber-400 ") +
            "flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 transition"
          }
        >
          <input
            type="radio"
            name={`upsell-${reference}`}
            checked={selected === opt.slug}
            onChange={() => setSelected(opt.slug)}
            className="h-4 w-4 accent-amber-600"
          />
          <span className="flex-1">
            <span className="block text-sm font-semibold text-slate-900">
              {opt.name}
            </span>
            <span className="block text-xs text-slate-500">
              {opt.description}
            </span>
          </span>
          <span className="text-sm font-semibold text-slate-900">
            +{formatPricePence(opt.priceGbp)}
          </span>
        </label>
      ))}

      {error && (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : dirty ? "Save changes" : "No changes"}
        </button>
      </div>
    </div>
  );
}
