export type Brand = { name: string; logo: string };

const slug = (n: string) =>
  n
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * Car marque artwork lives in `public/images/car-brands/<slug>.png`.
 * Tyre artwork is still the generated wordmark set, which is SVG.
 * The extensions differ per set, so they are declared here rather than
 * assumed — `npm run check:logos` fails the build if a file is missing.
 */
const carBrand = (name: string): Brand => ({
  name,
  logo: `/images/car-brands/${slug(name)}.png`,
});

const tyreBrand = (name: string): Brand => ({
  name,
  logo: `/images/tyre-brands/${slug(name)}.svg`,
});

/**
 * Car marques we service, MOT and repair.
 *
 * Ordered with the marques most common on UK roads first — they lead the
 * scrolling wall and are the ones customers scan for — followed by the rest
 * of the badges we hold artwork for, alphabetically.
 */
export const CAR_BRANDS: Brand[] = [
  // Most common on UK roads
  "Audi",
  "BMW",
  "Mercedes-Benz",
  "Volkswagen",
  "Ford",
  "Vauxhall",
  "Toyota",
  "Nissan",
  "Honda",
  "Hyundai",
  "Kia",
  "Peugeot",
  "Renault",
  "Citroën",
  "Škoda",
  "SEAT",
  "Volvo",
  "Mini",
  "Land Rover",
  "Jaguar",
  "Fiat",
  "Mazda",
  "Suzuki",
  "Tesla",
  // Everything else we hold artwork for
  "Abarth",
  "Alfa Romeo",
  "Aston Martin",
  "Baojun",
  "Beiben",
  "BYD",
  "Cadillac",
  "Chevrolet",
  "Chevrolet Corvette",
  "Chrysler",
  "Cupra",
  "Dacia",
  "Daewoo",
  "DAF",
  "Datsun",
  "Dodge",
  "Geely",
  "General Motors",
  "Genesis",
  "GMC",
  "Hino",
  "Infiniti",
  "Isuzu",
  "Jeep",
  "Lexus",
  "Lincoln",
  "Maserati",
  "Mitsubishi",
  "Opel",
  "Plymouth",
  "Polestar",
  "Porsche",
  "Renault Samsung",
  "Saab",
  "Scania",
  "Subaru",
  "Tata",
].map(carBrand);

/** Tyre brands we stock and can source. */
export const TYRE_BRANDS: Brand[] = [
  "Michelin",
  "Goodyear",
  "Dunlop",
  "Continental",
  "Bridgestone",
  "Pirelli",
  "Toyo",
  "Yokohama",
  "Falken",
  "Avon",
  "Nokian",
  "Hankook",
  "Kumho",
  "Firestone",
].map(tyreBrand);

/**
 * Splits a brand list into `rows` roughly equal chunks so every logo appears
 * in a scrolling row — nothing is left sitting in a static block.
 */
export function splitIntoRows<T>(items: T[], rows: number): T[][] {
  const out: T[][] = Array.from({ length: rows }, () => []);
  items.forEach((item, i) => out[i % rows].push(item));
  return out;
}
