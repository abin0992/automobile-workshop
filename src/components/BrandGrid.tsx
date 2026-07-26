import Image from "next/image";
import type { Brand } from "@/lib/brands";

export default function BrandGrid({ brands }: { brands: Brand[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {brands.map((brand) => (
        <li
          key={brand.name}
          className="flex h-20 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
        >
          <Image
            src={brand.logo}
            alt={`${brand.name} logo`}
            width={220}
            height={80}
            className="h-11 w-auto object-contain"
          />
        </li>
      ))}
    </ul>
  );
}
