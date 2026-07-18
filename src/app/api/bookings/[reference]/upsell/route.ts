import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Body = { addonSlug?: string | null };

export async function POST(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  const { reference } = await params;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body.addonSlug ?? null;
  let addonSlug: string | null = null;
  if (raw && raw !== "none") {
    if (raw !== "interim-service" && raw !== "full-service") {
      return NextResponse.json(
        { error: "Invalid add-on service." },
        { status: 400 }
      );
    }
    addonSlug = raw;
  }

  const existing = await db
    .select()
    .from(bookings)
    .where(eq(bookings.reference, reference))
    .limit(1);
  if (existing.length === 0) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  const bk = existing[0];
  if (bk.serviceSlug !== "mot-test") {
    return NextResponse.json(
      { error: "Add-ons can only be applied to an MOT booking." },
      { status: 400 }
    );
  }
  if (bk.status !== "confirmed") {
    return NextResponse.json(
      { error: "This booking can no longer be edited." },
      { status: 400 }
    );
  }

  await db
    .update(bookings)
    .set({ addonSlug })
    .where(eq(bookings.reference, reference));

  return NextResponse.json({ ok: true, addonSlug });
}
