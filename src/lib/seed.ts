import { db } from "@/db";
import { services } from "@/db/schema";
import { SERVICE_SEED } from "@/lib/services-data";
import { sql } from "drizzle-orm";

let seededPromise: Promise<void> | null = null;

async function doSeed() {
  const existing = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(services);
  const count = existing[0]?.count ?? 0;
  if (count > 0) return;

  await db.insert(services).values(SERVICE_SEED).onConflictDoNothing();
}

export function ensureSeeded(): Promise<void> {
  if (!seededPromise) {
    seededPromise = doSeed().catch((err) => {
      seededPromise = null;
      throw err;
    });
  }
  return seededPromise;
}
