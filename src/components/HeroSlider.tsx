"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type Slide = {
  src: string;
  alt: string;
};

const INTERVAL_MS = 6000;

export default function HeroSlider({
  slides,
  children,
}: {
  slides: Slide[];
  children?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
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
      className="relative isolate overflow-hidden bg-slate-950 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Workshop photos"
    >
      {/* Background images */}
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
              className={`object-cover ${i === index ? "scale-105" : "scale-100"} transition-transform duration-[7000ms] ease-out`}
            />
          </div>
        ))}
        {/* Legibility overlays */}
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/20" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(251,191,36,0.28), transparent 55%), radial-gradient(circle at 85% 70%, rgba(59,130,246,0.22), transparent 55%)",
          }}
        />
      </div>

      <div className="relative">{children}</div>

      {/* Controls */}
      <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 pb-8 sm:px-6">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next slide"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
        >
          ›
        </button>
        <div className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-amber-400" : "w-4 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
