"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPricePence, formatDuration } from "@/lib/format";

type BookableService = {
  slug: string;
  name: string;
  category: string;
  description: string;
  priceGbp: number;
  durationMinutes: number;
};

type Day = { iso: string; label: string; open: boolean };

type Slot = { time: string; available: boolean; remaining: number };

type Availability = { date: string; slots: Slot[]; reason?: string };

const STEPS = ["Service", "Date & time", "Your details"] as const;

export default function BookingForm({
  services,
  days,
  initialServiceSlug,
  hasPreSelection,
}: {
  services: BookableService[];
  days: Day[];
  initialServiceSlug: string;
  hasPreSelection?: boolean;
}) {
  const router = useRouter();

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [serviceSlug, setServiceSlug] = useState<string>(initialServiceSlug);

  useEffect(() => {
    setServiceSlug(initialServiceSlug);
  }, [initialServiceSlug]);
  const [serviceQuery, setServiceQuery] = useState("");
  const [addonSlug, setAddonSlug] = useState<"" | "interim-service" | "full-service">("");
  const [date, setDate] = useState<string>(() => days.find((d) => d.open)?.iso ?? "");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleReg, setVehicleReg] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedService = useMemo(
    () => services.find((s) => s.slug === serviceSlug),
    [services, serviceSlug]
  );
  const interimSvc = services.find((s) => s.slug === "interim-service");
  const fullSvc = services.find((s) => s.slug === "full-service");

  const groupedServices = useMemo(() => {
    const q = serviceQuery.trim().toLowerCase();
    const filtered = services.filter((s) => {
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    });
    const m = new Map<string, BookableService[]>();
    for (const s of filtered) {
      const list = m.get(s.category) ?? [];
      list.push(s);
      m.set(s.category, list);
    }
    const entries = Array.from(m.entries());
    const selCat = selectedService?.category;
    entries.sort(([a], [b]) => {
      if (a === selCat) return -1;
      if (b === selCat) return 1;
      return a.localeCompare(b);
    });
    for (const [, items] of entries) {
      items.sort((a, b) => {
        if (a.slug === serviceSlug) return -1;
        if (b.slug === serviceSlug) return 1;
        return a.name.localeCompare(b.name);
      });
    }
    return entries;
  }, [services, serviceQuery, selectedService, serviceSlug]);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    setError(null);
    fetch(`/api/availability?date=${encodeURIComponent(date)}`)
      .then((r) => r.json() as Promise<Availability>)
      .then((data) => {
        if (cancelled) return;
        setSlots(data.slots ?? []);
        // if current selection no longer valid, clear
        if (timeSlot && !(data.slots ?? []).some((s) => s.time === timeSlot && s.available)) {
          setTimeSlot("");
        }
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // Reset add-on if user picks a non-MOT service
  useEffect(() => {
    if (serviceSlug !== "mot-test" && addonSlug) setAddonSlug("");
  }, [serviceSlug, addonSlug]);

  const totalPricePence = useMemo(() => {
    let p = selectedService?.priceGbp ?? 0;
    if (addonSlug === "interim-service" && interimSvc) p += interimSvc.priceGbp;
    if (addonSlug === "full-service" && fullSvc) p += fullSvc.priceGbp;
    return p;
  }, [selectedService, addonSlug, interimSvc, fullSvc]);

  const canGoStep1 = Boolean(selectedService);
  const canGoStep2 = Boolean(date && timeSlot);
  const canSubmit =
    canGoStep2 &&
    customerName.trim() &&
    /.+@.+\..+/.test(email) &&
    phone.trim().length >= 7 &&
    vehicleReg.trim().length >= 2 &&
    vehicleDetails.trim().length >= 2;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug,
          addonSlug: addonSlug || null,
          customerName,
          email,
          phone,
          vehicleReg,
          vehicleDetails,
          bookingDate: date,
          timeSlot,
          notes,
        }),
      });
      const data = (await res.json()) as { reference?: string; error?: string };
      if (!res.ok || !data.reference) {
        setError(data.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }
      router.push(`/book/${data.reference}`);
    } catch {
      setError("Network error — please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8">
      {/* Step indicator */}
      <ol className="mb-8 flex items-center gap-2 text-sm">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={
                (i <= step
                  ? "bg-carbon-900 text-white"
                  : "bg-carbon-200 text-carbon-600") +
                " grid h-7 w-7 place-items-center rounded-full text-xs font-semibold"
              }
            >
              {i + 1}
            </span>
            <span
              className={
                i === step
                  ? "font-semibold text-carbon-900"
                  : "text-carbon-500"
              }
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 h-px w-6 bg-carbon-300" aria-hidden />
            )}
          </li>
        ))}
      </ol>

      {/* Step 0 — service */}
      {step === 0 && (
        <div className="rounded-2xl border border-carbon-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-carbon-950">
            Choose a service
          </h2>
          <p className="mt-1 text-sm text-carbon-600">
            Pick any item from our catalog — we&apos;ll fit you in at the next
            available slot.
          </p>

          {/* Top of list: Selected Service pinned prominently */}
          {selectedService && (
            <div className="mt-5 rounded-xl border-2 border-brand-500 bg-brand-50/80 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-carbon-950">
                  ★ Selected Service
                </span>
                <span className="text-xs font-semibold text-brand-800">
                  Top of your selection
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-3 rounded-lg border border-brand-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                    {selectedService.category}
                  </p>
                  <h3 className="mt-0.5 text-lg font-bold text-carbon-950">
                    {selectedService.name}
                  </h3>
                  <p className="mt-1 text-xs text-carbon-600">
                    {selectedService.description}
                  </p>
                  <p className="mt-2 text-xs font-medium text-carbon-500">
                    Duration ~ {formatDuration(selectedService.durationMinutes)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-carbon-100 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                  <p className="text-2xl font-bold text-carbon-950">
                    {selectedService.priceGbp === 0
                      ? "FREE"
                      : formatPricePence(selectedService.priceGbp)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 rounded-md bg-brand-500 px-4 py-2 text-xs font-bold text-carbon-950 shadow transition hover:bg-brand-400"
                  >
                    Select Date &amp; Time →
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="relative block">
              <span className="sr-only">Search services</span>
              <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-carbon-400"
              >
                🔍
              </span>
              <input
                type="search"
                value={serviceQuery}
                onChange={(e) => setServiceQuery(e.target.value)}
                placeholder="Search services…"
                className="w-full rounded-md border border-carbon-300 bg-white py-2 pl-10 pr-3 text-sm text-carbon-900 placeholder-carbon-400 focus:border-carbon-900 focus:outline-none focus:ring-2 focus:ring-carbon-900/20"
              />
            </label>
          </div>

          <div className="mt-5 space-y-6">
            {groupedServices.map(([cat, items]) => (
              <div key={cat}>
                <p className="text-xs font-semibold uppercase tracking-wider text-carbon-500">
                  {cat}
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {items.map((s) => {
                    const active = s.slug === serviceSlug;
                    return (
                      <button
                        key={s.slug}
                        type="button"
                        onClick={() => setServiceSlug(s.slug)}
                        className={
                          (active
                            ? "border-carbon-900 ring-2 ring-carbon-900/10 "
                            : "border-carbon-200 hover:border-carbon-400 ") +
                          "flex flex-col rounded-xl border bg-white p-4 text-left transition"
                        }
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-carbon-950">
                              {s.name}
                            </p>
                            {active && (
                              <span className="mt-1 inline-block rounded-full bg-carbon-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                                ✓ Selected
                              </span>
                            )}
                          </div>
                          <p className="text-base font-bold text-carbon-950">
                            {s.priceGbp === 0
                              ? "FREE"
                              : formatPricePence(s.priceGbp)}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-carbon-600">
                          {s.description}
                        </p>
                        <p className="mt-2 text-xs text-carbon-500">
                          Duration ~ {formatDuration(s.durationMinutes)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {groupedServices.length === 0 && (
              <p className="rounded-md border border-dashed border-carbon-300 bg-carbon-50 p-6 text-center text-sm text-carbon-500">
                No services match your search.
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              disabled={!canGoStep1}
              onClick={() => setStep(1)}
              className="rounded-md bg-carbon-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-carbon-800 disabled:opacity-50"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 1 — date/time */}
      {step === 1 && (
        <div className="rounded-2xl border border-carbon-200 bg-white p-6">
          {/* Selected Service Card */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-400 bg-brand-50/80 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Selected service
              </p>
              <h3 className="mt-0.5 text-base font-bold text-carbon-950">
                {selectedService?.name}{" "}
                <span className="text-sm font-semibold text-brand-800">
                  ({selectedService?.priceGbp === 0
                    ? "FREE"
                    : formatPricePence(selectedService?.priceGbp ?? 0)})
                </span>
              </h3>
              <p className="mt-1 text-xs text-carbon-600">
                {selectedService?.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="rounded-md border border-brand-400 bg-white px-3 py-1.5 text-xs font-semibold text-brand-950 shadow-sm transition hover:bg-brand-100"
            >
              Change service
            </button>
          </div>

          <h2 className="text-lg font-semibold text-carbon-950">
            Pick a date &amp; time
          </h2>
          <p className="mt-1 text-sm text-carbon-600">
            Live availability at our workshop. Sundays are closed.
          </p>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-carbon-500">
              Date
            </p>
            <div className="mt-2 -mx-2 flex gap-2 overflow-x-auto px-2 pb-2">
              {days.map((d) => {
                const active = d.iso === date;
                return (
                  <button
                    key={d.iso}
                    type="button"
                    onClick={() => d.open && setDate(d.iso)}
                    disabled={!d.open}
                    className={
                      (active
                        ? "border-carbon-900 bg-carbon-900 text-white "
                        : d.open
                        ? "border-carbon-200 bg-white text-carbon-800 hover:border-carbon-400 "
                        : "border-carbon-100 bg-carbon-50 text-carbon-400 line-through ") +
                      "flex-none rounded-lg border px-3 py-2 text-center text-xs font-medium transition"
                    }
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-carbon-500">
              Time
            </p>
            {loadingSlots ? (
              <p className="mt-3 text-sm text-carbon-500">Loading availability…</p>
            ) : slots.length === 0 ? (
              <p className="mt-3 text-sm text-carbon-500">
                No slots on this day. Pick another date.
              </p>
            ) : (
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {slots.map((s) => {
                  const active = s.time === timeSlot;
                  return (
                    <button
                      key={s.time}
                      type="button"
                      disabled={!s.available}
                      onClick={() => setTimeSlot(s.time)}
                      className={
                        (active
                          ? "border-carbon-900 bg-carbon-900 text-white "
                          : s.available
                          ? "border-carbon-200 bg-white text-carbon-800 hover:border-carbon-400 "
                          : "border-carbon-100 bg-carbon-50 text-carbon-400 line-through ") +
                        "rounded-md border py-2 text-sm font-medium transition"
                      }
                      title={
                        s.available
                          ? `${s.remaining} bay${s.remaining === 1 ? "" : "s"} available`
                          : "Fully booked"
                      }
                    >
                      {s.time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="rounded-md border border-carbon-300 px-4 py-2.5 text-sm font-semibold text-carbon-700 transition hover:bg-carbon-100"
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={!canGoStep2}
              onClick={() => setStep(2)}
              className="rounded-md bg-carbon-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-carbon-800 disabled:opacity-50"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — details */}
      {step === 2 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-carbon-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-carbon-950">Your details</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input"
                  autoComplete="name"
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  autoComplete="email"
                />
              </Field>
              <Field label="Phone" required>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                  autoComplete="tel"
                />
              </Field>
              <Field label="Vehicle reg" required>
                <input
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                  className="input font-mono uppercase"
                  placeholder="AB12 CDE"
                  maxLength={10}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Vehicle make &amp; model" required>
                  <input
                    value={vehicleDetails}
                    onChange={(e) => setVehicleDetails(e.target.value)}
                    className="input"
                    placeholder="e.g. Ford Focus 1.6 TDCi (2018)"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Anything else we should know? (optional)">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input min-h-[80px]"
                    placeholder="Warning lights, tyre sizes needed, etc."
                  />
                </Field>
              </div>
            </div>

            {/* MOT upsell */}
            {serviceSlug === "mot-test" && (interimSvc || fullSvc) && (
              <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-4">
                <p className="text-sm font-semibold text-brand-800">
                  💡 Add a service and save a visit
                </p>
                <p className="mt-1 text-xs text-brand-800/80">
                  Your car is already with us — get an Interim or Full Service
                  done at the same time.
                </p>
                <div className="mt-3 grid gap-2">
                  <UpsellOption
                    checked={addonSlug === ""}
                    onSelect={() => setAddonSlug("")}
                    title="Just the MOT, thanks"
                    price={0}
                  />
                  {interimSvc && (
                    <UpsellOption
                      checked={addonSlug === "interim-service"}
                      onSelect={() => setAddonSlug("interim-service")}
                      title="+ Interim Service"
                      subtitle="30-point check, oil & filter change"
                      price={interimSvc.priceGbp}
                    />
                  )}
                  {fullSvc && (
                    <UpsellOption
                      checked={addonSlug === "full-service"}
                      onSelect={() => setAddonSlug("full-service")}
                      title="+ Full Service"
                      subtitle="60-point check, includes air filter"
                      price={fullSvc.priceGbp}
                    />
                  )}
                </div>
              </div>
            )}

            {error && (
              <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-md border border-carbon-300 px-4 py-2.5 text-sm font-semibold text-carbon-700 transition hover:bg-carbon-100"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="rounded-md bg-brand-500 px-5 py-2.5 text-sm font-semibold text-carbon-950 transition hover:bg-brand-400 disabled:opacity-50"
              >
                {submitting ? "Confirming…" : "Confirm booking"}
              </button>
            </div>
          </div>

          {/* Summary sidebar */}
          <aside className="rounded-2xl border border-carbon-200 bg-white p-6 lg:sticky lg:top-24 lg:h-fit">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-carbon-500">
              Booking summary
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-carbon-500">Service</dt>
                <dd className="font-medium text-carbon-900">
                  {selectedService?.name ?? "—"}
                </dd>
              </div>
              {addonSlug && (
                <div>
                  <dt className="text-carbon-500">Add-on</dt>
                  <dd className="font-medium text-carbon-900">
                    {addonSlug === "interim-service"
                      ? interimSvc?.name
                      : fullSvc?.name}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-carbon-500">When</dt>
                <dd className="font-medium text-carbon-900">
                  {date || "—"} at {timeSlot || "—"}
                </dd>
              </div>
            </dl>
            <div className="mt-5 border-t border-carbon-100 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-carbon-500">Total</span>
                <span className="text-2xl font-bold text-carbon-950">
                  {formatPricePence(totalPricePence)}
                </span>
              </div>
              <p className="mt-1 text-xs text-carbon-500">
                No deposit — pay at the workshop.
              </p>
            </div>
          </aside>
        </div>
      )}

      <style jsx>{`
        /* Themed via the brand tokens in globals.css, so the form inputs
           pick up the same lime focus ring as the rest of the site. */
        :global(.input) {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid var(--color-carbon-300);
          background: white;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: var(--color-carbon-900);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.input:focus) {
          border-color: var(--color-brand-500);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand-500) 25%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-carbon-600">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function UpsellOption({
  checked,
  onSelect,
  title,
  subtitle,
  price,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  subtitle?: string;
  price: number;
}) {
  return (
    <label
      className={
        (checked
          ? "border-brand-500 bg-white ring-2 ring-brand-500/20 "
          : "border-transparent bg-white/60 hover:border-brand-500 ") +
        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition"
      }
    >
      <input
        type="radio"
        name="addon"
        checked={checked}
        onChange={onSelect}
        className="h-4 w-4 accent-brand-600"
      />
      <span className="flex-1">
        <span className="block text-sm font-semibold text-carbon-900">{title}</span>
        {subtitle && (
          <span className="block text-xs text-carbon-500">{subtitle}</span>
        )}
      </span>
      <span className="text-sm font-semibold text-carbon-900">
        {price === 0 ? "—" : `+${formatPricePence(price)}`}
      </span>
    </label>
  );
}
