"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type Slide = {
  src: string;
  alt: string;
  /**
   * Optional focal point. The shopfront photo has the signage in the upper
   * third, so a plain `object-center` crop loses the logo on short viewports.
   */
  position?: string;
};

const INTERVAL_MS = 6500;

export default function HeroSlider({
  slides,
  children,
}: {
  slides: Slide[];
  children?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused || slides.length < 2) return;

    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      INTERVAL_MS,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, slides.length]);

  return (
    <section
      className="relative isolate overflow-hidden bg-carbon-950 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Marton Road MOT Centre workshop"
    >
      <div aria-hidden className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              style={{ objectPosition: slide.position ?? "center" }}
              className={`object-cover motion-safe:transition-transform motion-safe:duration-[8000ms] motion-safe:ease-out ${
                i === index ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        ))}

        {/*
          Legibility stack. The shopfront photo was taken on an overcast day,
          so it is bright at the top — the gradient is weighted to the left
          and bottom where the headline and stats sit.
        */}
        <div className="absolute inset-0 bg-carbon-950/72" />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon-950 via-carbon-950/80 to-carbon-950/35" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-carbon-950 to-transparent" />
        {/* Brand-lime glow, tying the dark hero back to the signage */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 18%, rgba(125,194,66,0.20), transparent 52%), radial-gradient(circle at 88% 78%, rgba(125,194,66,0.10), transparent 55%)",
          }}
        />
      </div>

      <div className="relative">{children}</div>

      <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 pb-8 sm:px-6">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous photo"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:border-brand-500 hover:bg-brand-500 hover:text-carbon-950"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next photo"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:border-brand-500 hover:bg-brand-500 hover:text-carbon-950"
        >
          ›
        </button>
        <div className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-brand-500" : "w-4 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
