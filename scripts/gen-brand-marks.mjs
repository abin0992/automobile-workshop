import { mkdirSync, writeFileSync } from "node:fs";

const car = [
  ["Audi", "#1a1a1a"], ["BMW", "#0166B1"], ["Mercedes-Benz", "#1a1a1a"],
  ["Volkswagen", "#0d3b8c"], ["Ford", "#003478"], ["Vauxhall", "#b8121b"],
  ["Toyota", "#d0021b"], ["Nissan", "#1a1a1a"], ["Honda", "#cc0000"],
  ["Hyundai", "#002c5f"], ["Kia", "#05141f"], ["Peugeot", "#1a1a1a"],
  ["Renault", "#c8a02a"], ["Citroën", "#a00b1e"], ["Škoda", "#0e3a2f"],
  ["SEAT", "#a5232f"], ["Volvo", "#003057"], ["Mini", "#1a1a1a"],
  ["Land Rover", "#005a2b"], ["Jaguar", "#22303a"], ["Fiat", "#8b1e2d"],
  ["Mazda", "#101010"], ["Suzuki", "#e30613"], ["Tesla", "#cc0000"],
];

const tyre = [
  ["Michelin", "#28348a"], ["Goodyear", "#0f4c9c"], ["Dunlop", "#e0b000"],
  ["Continental", "#ffa500"], ["Bridgestone", "#d4022a"], ["Pirelli", "#d4022a"],
  ["Toyo", "#c8102e"], ["Yokohama", "#c8102e"], ["Falken", "#0a3d91"],
  ["Avon", "#1f3b73"], ["Nokian", "#00953a"], ["Hankook", "#e2001a"],
  ["Kumho", "#003da5"], ["Firestone", "#d4022a"],
];

const slug = (n) =>
  n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function svg(name, colour, kind) {
  const w = 220, h = 80;
  const initial = name.replace(/[^A-Za-z]/g, "").slice(0, 1).toUpperCase();
  const fs = name.length > 11 ? 22 : name.length > 8 ? 26 : 30;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${name}">
  <title>${name}</title>
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="12" fill="#ffffff" stroke="${colour}" stroke-opacity=".25" stroke-width="2"/>
  ${kind === "tyre"
      ? `<circle cx="40" cy="40" r="21" fill="none" stroke="${colour}" stroke-width="7"/><circle cx="40" cy="40" r="8" fill="${colour}"/>`
      : `<circle cx="40" cy="40" r="22" fill="${colour}"/><text x="40" y="40" font-family="Inter, Helvetica, Arial, sans-serif" font-size="24" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="central">${initial}</text>`}
  <text x="74" y="41" font-family="Inter, Helvetica, Arial, sans-serif" font-size="${fs}" font-weight="700" letter-spacing="-0.5" fill="${colour}" dominant-baseline="central">${name.replace(/&/g, "&amp;")}</text>
</svg>`;
}

for (const [dir, list, kind] of [["car-brands", car, "car"], ["tyre-brands", tyre, "tyre"]]) {
  const out = `public/images/${dir}`;
  mkdirSync(out, { recursive: true });
  for (const [name, colour] of list) writeFileSync(`${out}/${slug(name)}.svg`, svg(name, colour, kind));
  console.log(dir, list.length);
}
