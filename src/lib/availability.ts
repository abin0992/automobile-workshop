import { db } from "@/db";
import { bookings } from "@/db/schema";
import { and, eq } from "drizzle-orm";

// Weekday hours: 08:00 - 17:00 (last start 17:00 for shorter jobs)
// Saturday: 08:00 - 13:00
// Sunday: closed
// Capacity per slot (concurrent jobs the garage can handle)
export const SLOT_CAPACITY = 2;

export function generateSlotsForDate(dateIso: string): string[] {
  const [y, m, d] = dateIso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const day = dt.getUTCDay(); // 0 = Sun, 6 = Sat
  if (day === 0) return [];
  const slots: string[] = [];
  const start = 8;
  const end = day === 6 ? 13 : 17;
  for (let h = start; h <= end; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
}

export function isDateBookable(dateIso: string): boolean {
  const [y, m, d] = dateIso.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1, d));
  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  if (target.getTime() < todayUtc.getTime()) return false;
  // Only allow within 60 days
  const maxDate = new Date(todayUtc);
  maxDate.setUTCDate(maxDate.getUTCDate() + 60);
  if (target.getTime() > maxDate.getTime()) return false;
  return target.getUTCDay() !== 0;
}

export function getNext60Days(): { iso: string; label: string; open: boolean }[] {
  const out: { iso: string; label: string; open: boolean }[] = [];
  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  for (let i = 0; i < 60; i++) {
    const d = new Date(todayUtc);
    d.setUTCDate(d.getUTCDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const label = new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(d);
    out.push({ iso, label, open: d.getUTCDay() !== 0 });
  }
  return out;
}

export type SlotAvailability = { time: string; available: boolean; remaining: number };

export async function getAvailabilityForDate(
  dateIso: string
): Promise<SlotAvailability[]> {
  const slots = generateSlotsForDate(dateIso);
  if (slots.length === 0) return [];

  const rows = await db
    .select({ timeSlot: bookings.timeSlot })
    .from(bookings)
    .where(and(eq(bookings.bookingDate, dateIso), eq(bookings.status, "confirmed")));

  const counts = new Map<string, number>();
  for (const r of rows) {
    const key = r.timeSlot.slice(0, 5);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return slots.map((time) => {
    const used = counts.get(time) ?? 0;
    const remaining = Math.max(0, SLOT_CAPACITY - used);
    return { time, available: remaining > 0, remaining };
  });
}
