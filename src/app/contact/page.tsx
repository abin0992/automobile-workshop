export const metadata = { title: "Contact — Marton Road MOT Centre" };

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-wider text-amber-600">
        Get in touch
      </p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">Contact us</h1>
      <p className="mt-3 max-w-2xl text-slate-700">
        For bookings, please use the online booking form for the fastest
        confirmation. For anything else, we&apos;re here Monday to Saturday.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Workshop</h2>
          <address className="mt-3 not-italic text-sm text-slate-700">
            Marton Road MOT Centre<br />
            416 Marton Rd<br />
            Middlesbrough TS4 2PT<br />
            United Kingdom
          </address>
          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Phone
              </dt>
              <dd className="mt-1">
                <a
                  href="tel:+441642555019"
                  className="font-medium text-slate-900 hover:underline"
                >
                  01642 555 019
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Bookings
              </dt>
              <dd className="mt-1">
                <a
                  href="mailto:bookings@martonroadmot.co.uk"
                  className="font-medium text-slate-900 hover:underline"
                >
                  bookings@martonroadmot.co.uk
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                General enquiries
              </dt>
              <dd className="mt-1">
                <a
                  href="mailto:hello@martonroadmot.co.uk"
                  className="font-medium text-slate-900 hover:underline"
                >
                  hello@martonroadmot.co.uk
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Opening hours</h2>
          <ul className="mt-3 divide-y divide-slate-100 text-sm">
            {[
              ["Monday", "08:00 – 18:00"],
              ["Tuesday", "08:00 – 18:00"],
              ["Wednesday", "08:00 – 18:00"],
              ["Thursday", "08:00 – 18:00"],
              ["Friday", "08:00 – 18:00"],
              ["Saturday", "08:00 – 14:00"],
              ["Sunday", "Closed"],
            ].map(([d, h]) => (
              <li key={d} className="flex justify-between py-2">
                <span className="text-slate-600">{d}</span>
                <span className="font-medium text-slate-900">{h}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Bank holidays: closed. Between-Christmas hours announced in December.
          </p>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <div className="grid grid-cols-8 grid-rows-6">
          {/* Decorative CSS map */}
          <div className="col-span-8 row-span-6 aspect-[16/7] bg-gradient-to-br from-slate-200 via-slate-100 to-emerald-50">
            <div className="grid h-full grid-cols-8 grid-rows-6">
              <div className="col-span-8 row-span-6 relative">
                <div className="absolute inset-x-8 top-1/2 h-2 -translate-y-1/2 bg-amber-300/60" />
                <div className="absolute inset-y-8 left-1/3 w-1 bg-slate-300" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="flex flex-col items-center">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-400 text-slate-950 shadow-md">
                      📍
                    </span>
                    <span className="mt-1 rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white">
                      Marton Road MOT Centre
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
