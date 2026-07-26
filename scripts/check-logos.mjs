/**
 * Verifies every logo referenced by src/lib/brands.ts actually exists in
 * public/.
 *
 * A missing file is invisible in development — Next just serves a 404 and the
 * card renders empty — so this runs as part of `npm run lint` and before
 * builds to catch a renamed or re-exported logo set immediately.
 *
 *   node scripts/check-logos.mjs
 */
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const { CAR_BRANDS, TYRE_BRANDS } = await import(
  join(root, "src/lib/brands.ts")
);

const missing = [];
const seen = new Map();

for (const [label, list] of [
  ["car", CAR_BRANDS],
  ["tyre", TYRE_BRANDS],
]) {
  for (const brand of list) {
    const file = join(root, "public", brand.logo);
    if (!existsSync(file)) missing.push(`${label}: ${brand.name} → ${brand.logo}`);

    const key = `${label}:${brand.name}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
}

const duplicates = [...seen].filter(([, n]) => n > 1).map(([k]) => k);

if (missing.length || duplicates.length) {
  if (missing.length) {
    console.error(`\n✗ ${missing.length} logo file(s) referenced but not found:`);
    for (const m of missing) console.error(`   ${m}`);
  }
  if (duplicates.length) {
    console.error(`\n✗ ${duplicates.length} duplicate brand entr(y/ies):`);
    for (const d of duplicates) console.error(`   ${d}`);
  }
  console.error("");
  process.exit(1);
}

console.log(
  `✓ ${CAR_BRANDS.length} car and ${TYRE_BRANDS.length} tyre logos all present.`,
);
