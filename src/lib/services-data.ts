import type { NewService } from "@/db/schema";

// Seed catalog of services offered
export const SERVICE_SEED: NewService[] = [
  {
    slug: "mot-test",
    name: "MOT Test (Class 4)",
    category: "MOT",
    description:
      "Government-mandated annual safety and emissions test for cars, small vans and light vehicles up to 3,000kg.",
    priceGbp: 5495,
    durationMinutes: 60,
    bookable: true,
  },
  {
    slug: "interim-service",
    name: "Interim Service",
    category: "Servicing",
    description:
      "A 30-point inspection recommended every 6 months or 6,000 miles. Includes oil & filter change, top-ups and safety checks.",
    priceGbp: 11900,
    durationMinutes: 90,
    bookable: true,
  },
  {
    slug: "full-service",
    name: "Full Service",
    category: "Servicing",
    description:
      "A comprehensive 60-point service every 12 months or 12,000 miles. Includes air filter, deeper inspection and diagnostics.",
    priceGbp: 18900,
    durationMinutes: 120,
    bookable: true,
  },
  {
    slug: "major-service",
    name: "Major Service",
    category: "Servicing",
    description:
      "Our most comprehensive 70+ point service every 24 months or 24,000 miles. Includes spark plugs, fuel filter and cabin filter.",
    priceGbp: 27900,
    durationMinutes: 180,
    bookable: true,
  },
  {
    slug: "brake-inspection",
    name: "Brake Inspection & Report",
    category: "Brakes",
    description:
      "Full inspection of pads, discs, callipers and fluid. Written report and a no-obligation quote for any work required.",
    priceGbp: 3500,
    durationMinutes: 45,
    bookable: false,
  },
  {
    slug: "brake-pads-front",
    name: "Front Brake Pads (fitted)",
    category: "Brakes",
    description:
      "Replacement of front brake pads including quality OEM-grade parts, labour and disposal.",
    priceGbp: 12500,
    durationMinutes: 60,
    bookable: false,
  },
  {
    slug: "brake-discs-pads-front",
    name: "Front Discs & Pads (fitted)",
    category: "Brakes",
    description:
      "Replace worn front discs and pads. Includes parts, labour and old part disposal.",
    priceGbp: 22900,
    durationMinutes: 90,
    bookable: false,
  },
  {
    slug: "air-con-regas",
    name: "Air Conditioning Re-Gas (R134a)",
    category: "Air Conditioning",
    description:
      "Vacuum test, refill of refrigerant gas and leak check. Suitable for most vehicles registered before 2017.",
    priceGbp: 5900,
    durationMinutes: 45,
    bookable: false,
  },
  {
    slug: "air-con-regas-1234yf",
    name: "Air Conditioning Re-Gas (R1234yf)",
    category: "Air Conditioning",
    description:
      "For newer vehicles using R1234yf refrigerant. Includes leak test and full refill.",
    priceGbp: 9900,
    durationMinutes: 60,
    bookable: false,
  },
  {
    slug: "diagnostics",
    name: "Engine Diagnostics",
    category: "Diagnostics",
    description:
      "Plug-in diagnostics scan for engine management, ABS, airbag and transmission fault codes. Includes verbal report.",
    priceGbp: 4900,
    durationMinutes: 45,
    bookable: false,
  },
  {
    slug: "cambelt-replacement",
    name: "Cambelt / Timing Belt Replacement",
    category: "Engine",
    description:
      "Replacement of the timing belt at manufacturer intervals. Price varies by vehicle — call for a firm quote.",
    priceGbp: 39900,
    durationMinutes: 240,
    bookable: false,
  },
  {
    slug: "clutch-replacement",
    name: "Clutch Replacement",
    category: "Engine",
    description:
      "Removal and replacement of clutch kit including labour. Guide price from — contact us for a vehicle-specific quote.",
    priceGbp: 69900,
    durationMinutes: 360,
    bookable: false,
  },
  {
    slug: "battery-test-replace",
    name: "Battery Test & Replacement",
    category: "Electrical",
    description:
      "Free battery health test. Replacement batteries fitted from stock with 3-year warranty.",
    priceGbp: 9900,
    durationMinutes: 30,
    bookable: false,
  },
  {
    slug: "wheel-alignment",
    name: "4-Wheel Laser Alignment",
    category: "Wheels & Tyres",
    description:
      "Full 4-wheel laser alignment to manufacturer specification. Improves tyre life and handling.",
    priceGbp: 5900,
    durationMinutes: 60,
    bookable: false,
  },
  {
    slug: "wheel-balancing",
    name: "Wheel Balancing (per wheel)",
    category: "Wheels & Tyres",
    description:
      "Removes vibration and uneven tyre wear. Includes new balance weights.",
    priceGbp: 1200,
    durationMinutes: 15,
    bookable: false,
  },
  {
    slug: "tyre-fitting",
    name: "Tyre Fitting (per tyre)",
    category: "Wheels & Tyres",
    description:
      "Tyre supply and fit including new valve, balancing and old tyre disposal. See our Tyres page for stock.",
    priceGbp: 1800,
    durationMinutes: 20,
    bookable: false,
  },
  {
    slug: "exhaust-inspection",
    name: "Exhaust Inspection",
    category: "Exhaust",
    description:
      "Full visual inspection of exhaust system. Written quote for any repairs required.",
    priceGbp: 0,
    durationMinutes: 20,
    bookable: false,
  },
  {
    slug: "headlight-restoration",
    name: "Headlight Restoration",
    category: "Bodywork",
    description:
      "Machine polish and seal cloudy headlight lenses. Restores brightness and passes MOT.",
    priceGbp: 4900,
    durationMinutes: 60,
    bookable: false,
  },
];

export const BOOKABLE_SLUGS = [
  "mot-test",
  "interim-service",
  "full-service",
  "major-service",
] as const;

export type BookableSlug = (typeof BOOKABLE_SLUGS)[number];

export function isBookableSlug(slug: string): slug is BookableSlug {
  return (BOOKABLE_SLUGS as readonly string[]).includes(slug);
}
