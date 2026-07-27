import Image from "next/image";
import type { Brand } from "@/lib/brands";

/**
 * Static logo grid. Cards are a fixed height and the logo is constrained on
 * both axes (`h-11 w-full object-contain`), so wide wordmarks such as SAAB or
 * Scania scale down to fit instead of overflowing the card.
 */
export default function BrandGrid({ brands }: { brands: Brand[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {brands.map((brand) => (
        <li
          key={brand.name}
          className="flex h-20 items-center justify-center rounded-xl border border-carbon-200 bg-white px-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md"
        >
          <Image
            src={brand.logo}
            alt={`${brand.name} logo`}
            title={brand.name}
            width={200}
            height={80}
            sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 45vw"
            className="h-11 w-full object-contain"
          />
        </li>
      ))}
    </ul>
  );
}
