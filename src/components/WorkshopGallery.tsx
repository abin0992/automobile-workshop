import Image from "next/image";

/**
 * Editorial photo band showing the work itself.
 *
 * This replaces the old full-bleed hero carousel. A slider hid three of its
 * four photos behind an auto-advancing timer, so most visitors never saw
 * them and the ones they did see were covered by the headline overlay. Laid
 * out as a static mosaic, every photo is visible at once, each carries a
 * caption that says what is actually happening, and there is no motion to
 * wait on.
 */
const SHOTS = [
  {
    src: "/images/slider/slider-2.jpg",
    alt: "A technician inspecting front brakes on a car raised on the two-post lift during an MOT",
    caption: "MOT testing",
    body: "Class 4 tests on site, with a free re-test within 10 working days.",
    className: "sm:col-span-2 sm:row-span-2",
    sizes: "(min-width: 1024px) 640px, (min-width: 640px) 60vw, 100vw",
    priority: true,
  },
  {
    src: "/images/slider/slider-4.jpg",
    alt: "A mechanic checking engine oil on the dipstick with the bonnet raised",
    caption: "Servicing",
    body: "Interim, full and major services to schedule.",
    className: "",
    sizes: "(min-width: 1024px) 320px, (min-width: 640px) 40vw, 100vw",
  },
  {
    src: "/images/slider/slider-3.jpg",
    alt: "A tyre being fitted to an alloy wheel on the tyre machine, with racked tyres behind",
    caption: "Tyres & balancing",
    body: "Premium, mid-range and budget, fitted same day.",
    className: "",
    sizes: "(min-width: 1024px) 320px, (min-width: 640px) 40vw, 100vw",
  },
];

export default function WorkshopGallery() {
  return (
    <ul className="grid gap-4 sm:grid-cols-3 sm:grid-rows-2">
      {SHOTS.map((shot) => (
        <li
          key={shot.src}
          className={`group relative overflow-hidden rounded-2xl border border-carbon-200 bg-carbon-950 shadow-sm ${shot.className}`}
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            width={1376}
            height={768}
            priority={shot.priority}
            sizes={shot.sizes}
            className="h-full min-h-52 w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/35 to-transparent"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
            <p className="font-display text-xl font-bold uppercase tracking-wide text-white">
              <span aria-hidden className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-500 align-middle" />
              {shot.caption}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-carbon-300">
              {shot.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
