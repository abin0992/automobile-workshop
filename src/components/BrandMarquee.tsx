import Image from "next/image";
import type { Brand } from "@/lib/brands";

/**
 * Scrolling logo wall.
 *
 * The list is rendered twice and the track is translated by exactly -50%, so
 * the second copy lands precisely where the first began and the loop is
 * seamless. That only holds if every item occupies the same horizontal pitch,
 * which is why the spacing is a right margin on each card rather than a flex
 * `gap`: a `gap` is applied *between* items only, so the track would be one
 * gap narrower than two whole copies and the animation would jump on each
 * cycle.
 *
 * Pauses on hover and on keyboard focus. Under `prefers-reduced-motion` the
 * track stops animating, so it reflows into a centred wrapping grid and the
 * duplicate copy is hidden — otherwise everything past the first row's width
 * would be clipped and unreachable.
 */
export default function BrandMarquee({
  brands,
  speedSeconds = 45,
  reverse = false,
}: {
  brands: Brand[];
  speedSeconds?: number;
  /** Scroll right-to-left (default) or left-to-right. */
  reverse?: boolean;
}) {
  if (brands.length === 0) return null;

  const track = [...brands, ...brands];

  return (
    <div className="group relative overflow-hidden motion-reduce:overflow-visible [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:[mask-image:none]">
      <ul
        className="flex w-max items-center py-2 motion-safe:animate-[brand-marquee_var(--marquee-duration)_linear_infinite] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center"
        style={{
          ["--marquee-duration" as string]: `${speedSeconds}s`,
          animationDirection: reverse ? "reverse" : undefined,
        }}
      >
        {track.map((brand, i) => {
          const isDuplicate = i >= brands.length;

          return (
            <li
              key={`${brand.name}-${i}`}
              aria-hidden={isDuplicate}
              className={`mr-4 mb-0 flex h-16 w-40 shrink-0 items-center justify-center rounded-xl border border-carbon-200 bg-white px-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md motion-reduce:mb-4 ${
                isDuplicate ? "motion-reduce:hidden" : ""
              }`}
            >
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                title={brand.name}
                width={160}
                height={64}
                sizes="160px"
                /**
                 * The duplicate copy — and most of the first — sits outside the
                 * clipped track, so lazy loading would leave blank cards
                 * scrolling into view. These are a few KB each; fetch them up
                 * front.
                 */
                loading="eager"
                className="h-10 w-full object-contain"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
