import Image from "next/image";
import type { Brand } from "@/lib/brands";

/**
 * Scrolling logo wall. Renders the list twice so the CSS animation loops
 * seamlessly; pauses on hover and for reduced-motion users.
 */
export default function BrandMarquee({
  brands,
  speedSeconds = 45,
}: {
  brands: Brand[];
  speedSeconds?: number;
}) {
  const track = [...brands, ...brands];

  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <ul
        className="flex w-max items-center gap-4 py-2 motion-safe:animate-[brand-marquee_var(--marquee-duration)_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: `${speedSeconds}s` }}
      >
        {track.map((brand, i) => (
          <li
            key={`${brand.name}-${i}`}
            aria-hidden={i >= brands.length}
            className="flex h-16 w-40 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              width={220}
              height={80}
              className="h-10 w-auto object-contain"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
