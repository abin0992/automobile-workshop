import { NextResponse } from "next/server";
import { getAvailabilityForDate, isDateBookable } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Missing or invalid 'date' (YYYY-MM-DD)." },
      { status: 400 }
    );
  }
  if (!isDateBookable(date)) {
    return NextResponse.json({ date, slots: [], reason: "closed" });
  }
  const slots = await getAvailabilityForDate(date);
  return NextResponse.json({ date, slots });
}
