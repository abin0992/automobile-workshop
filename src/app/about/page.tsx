import Link from "next/link";

export const metadata = {
  title: "About — Marton Road MOT Centre",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-wider text-amber-600">
        About us
      </p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">
        Two decades keeping Middlesbrough on the road.
      </h1>
      <p className="mt-6 text-lg text-slate-700">
        Marton Road MOT Centre was founded in 2004 by Dave Reeves, a former
        main-dealer master technician who wanted to offer main-dealer quality
        without the main-dealer price tag. Two decades on, we&apos;re still an
        independent, family-run garage on Marton Road — and we still do things
        the right way.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-3xl font-bold text-amber-600">40,000+</p>
          <p className="mt-1 text-sm text-slate-600">
            MOT tests carried out since we opened our doors.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-3xl font-bold text-amber-600">6</p>
          <p className="mt-1 text-sm text-slate-600">
            Full-time technicians, each with 10+ years&apos; experience.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-3xl font-bold text-amber-600">4.9 ★</p>
          <p className="mt-1 text-sm text-slate-600">
            Average rating from over 1,200 Google reviews.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-3xl font-bold text-amber-600">100%</p>
          <p className="mt-1 text-sm text-slate-600">
            No-work-without-your-say-so guarantee. Ever.
          </p>
        </div>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-slate-950">Our promise</h2>
      <ul className="mt-4 space-y-3 text-slate-700">
        {[
          "We will always call before starting any work you haven't already approved.",
          "Every job comes with an itemised invoice showing parts, labour and VAT.",
          "All work is covered by a 12-month / 12,000-mile parts-and-labour warranty.",
          "We only fit OEM or OEM-equivalent parts unless you specifically ask otherwise.",
        ].map((line) => (
          <li key={line} className="flex items-start gap-3">
            <span className="mt-1 grid h-5 w-5 flex-none place-items-center rounded-full bg-amber-400 text-xs font-bold text-slate-950">
              ✓
            </span>
            {line}
          </li>
        ))}
      </ul>

      <div className="mt-12 rounded-xl bg-slate-950 p-8 text-white">
        <h2 className="text-2xl font-bold">Ready when you are.</h2>
        <p className="mt-2 text-slate-300">
          Book online in under 60 seconds — pick a service, choose a slot,
          you&apos;re done.
        </p>
        <Link
          href="/book"
          className="mt-5 inline-flex items-center rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
        >
          Book online →
        </Link>
      </div>
    </main>
  );
}
