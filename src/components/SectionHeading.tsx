import type { ReactNode } from "react";

/**
 * Shared section header. The small lime eyebrow with a leading rule is the
 * repeating motif of the redesign — it appears above every major block, so
 * the page scans as a consistent system rather than a stack of one-offs.
 */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "light",
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
}) {
  const centered = align === "center";
  const dark = tone === "dark";

  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p
        className={`flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-600 ${
          centered ? "justify-center" : ""
        } ${dark ? "text-brand-400" : ""}`}
      >
        <span aria-hidden className="h-px w-7 bg-brand-500" />
        {eyebrow}
      </p>
      <Tag
        className={`mt-3 font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl ${
          dark ? "text-white" : "text-carbon-950"
        }`}
      >
        {title}
      </Tag>
      {intro && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            dark ? "text-carbon-300" : "text-carbon-600"
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
