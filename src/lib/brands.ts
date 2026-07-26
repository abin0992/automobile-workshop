export type Brand = { name: string; logo: string };

const slug = (n: string) =>
  n
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const carBrand = (name: string): Brand => ({
  name,
  logo: `/images/car-brands/${slug(name)}.svg`,
});

const tyreBrand = (name: string): Brand => ({
  name,
  logo: `/images/tyre-brands/${slug(name)}.svg`,
});

/** Car marques we service, MOT and repair. */
export const CAR_BRANDS: Brand[] = [
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
