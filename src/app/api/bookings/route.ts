import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, services } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import {
  SLOT_CAPACITY,
  generateSlotsForDate,
  isDateBookable,
} from "@/lib/availability";
import { generateBookingReference } from "@/lib/format";

export const dynamic = "force-dynamic";

type BookingBody = {
  serviceSlug?: string;
  addonSlug?: string | null;
  customerName?: string;
  email?: string;
  phone?: string;
  vehicleReg?: string;
  vehicleDetails?: string;
  bookingDate?: string;
  timeSlot?: string;
  notes?: string;
};

export async function POST(request: Request) {
  let body: BookingBody;
  try {
    body = (await request.json()) as BookingBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const required: (keyof BookingBody)[] = [
    "serviceSlug",
    "customerName",
    "email",
    "phone",
    "vehicleReg",
    "vehicleDetails",
    "bookingDate",
    "timeSlot",
  ];
  for (const k of required) {
    if (!body[k] || String(body[k]).trim() === "") {
      return NextResponse.json(
        { error: `Missing required field: ${k}` },
        { status: 400 }
      );
    }
  }

  const serviceSlug = String(body.serviceSlug);

  const bookingDate = String(body.bookingDate);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate) || !isDateBookable(bookingDate)) {
    return NextResponse.json(
      { error: "Chosen date is not available for booking." },
      { status: 400 }
    );
  }

  const timeSlot = String(body.timeSlot);
  if (!/^\d{2}:\d{2}$/.test(timeSlot)) {
    return NextResponse.json(
      { error: "Invalid time slot format." },
      { status: 400 }
    );
  }
  const slotsForDay = generateSlotsForDate(bookingDate);
  if (!slotsForDay.includes(timeSlot)) {
    return NextResponse.json(
      { error: "That time slot is not offered on the chosen date." },
      { status: 400 }
    );
  }

  // Validate optional add-on
  let addonSlug: string | null = null;
  if (body.addonSlug) {
    const raw = String(body.addonSlug);
    if (raw !== "" && raw !== "none") {
      if (raw !== "interim-service" && raw !== "full-service") {
        return NextResponse.json(
          { error: "Invalid add-on service." },
          { status: 400 }
        );
      }
      // Add-on only makes sense on an MOT
      if (serviceSlug !== "mot-test") {
        return NextResponse.json(
          { error: "Add-on services are only available with an MOT booking." },
          { status: 400 }
        );
      }
      addonSlug = raw;
    }
  }

  // Ensure the service exists in DB (belt and braces)
  const svc = await db
    .select()
    .from(services)
    .where(eq(services.slug, serviceSlug))
    .limit(1);
  if (svc.length === 0) {
    return NextResponse.json(
      { error: "Service not found." },
      { status: 400 }
    );
  }

  // Concurrency check: count existing confirmed bookings in slot
  const existing = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(
      and(
        eq(bookings.bookingDate, bookingDate),
        eq(bookings.timeSlot, `${timeSlot}:00`),
        eq(bookings.status, "confirmed")
      )
    );
  if (existing.length >= SLOT_CAPACITY) {
    return NextResponse.json(
      { error: "Sorry — that slot was just booked. Please choose another." },
      { status: 409 }
    );
  }

  // Insert with unique reference (retry a few times on the vanishingly rare collision)
  let reference = generateBookingReference();
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const [row] = await db
        .insert(bookings)
        .values({
          reference,
          serviceSlug,
          addonSlug,
          customerName: String(body.customerName).trim(),
          email: String(body.email).trim(),
          phone: String(body.phone).trim(),
          vehicleReg: String(body.vehicleReg).trim().toUpperCase(),
          vehicleDetails: String(body.vehicleDetails).trim(),
          bookingDate,
          timeSlot: `${timeSlot}:00`,
          notes: body.notes ? String(body.notes).trim() : null,
          status: "confirmed",
        })
        .returning();
      return NextResponse.json({ reference: row.reference }, { status: 201 });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("bookings_reference")) {
        reference = generateBookingReference();
        continue;
      }
      console.error("Booking insert failed:", err);
      return NextResponse.json(
        { error: "Something went wrong creating your booking." },
        { status: 500 }
      );
    }
  }
  return NextResponse.json(
    { error: "Could not create booking, please try again." },
    { status: 500 }
  );
}
