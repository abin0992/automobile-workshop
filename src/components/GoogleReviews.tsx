import type { GoogleReviewSummary } from "@/lib/reviews";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span
      className="text-amber-400"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
      role="img"
    >
      {"★".repeat(full)}
      <span className="text-slate-300">{"★".repeat(5 - full)}</span>
    </span>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h11.8a10.1 10.1 0 0 1-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.4Z"
      />
      <path
        fill="#34A853"
        d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.1H4.3v5.7A22 22 0 0 0 24 46Z"
      />
      <path
        fill="#FBBC05"
        d="M11.6 28.1a13.2 13.2 0 0 1 0-8.2v-5.7H4.3a22 22 0 0 0 0 19.6l7.3-5.7Z"
      />
      <path
        fill="#EA4335"
        d="M24 9.6c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C34.9 3 30 1 24 1 15.5 1 8.1 5.9 4.3 13.2l7.3 5.7C13.3 13.5 18.2 9.6 24 9.6Z"
      />
    </svg>
  );
}

export default function GoogleReviews({
  summary,
  heading = "What our customers say",
  intro = "Verified reviews from our Google Business Profile.",
}: {
  summary: GoogleReviewSummary;
  heading?: string;
  intro?: string;
}) {
  return (
    <section className="border-y border-slate-200 bg-slate-100/70">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-amber-600">
              Reviews
            </p>
            <h2 className="mt-1 text-3xl font-bold text-slate-950">{heading}</h2>
            <p className="mt-2 max-w-2xl text-slate-600">{intro}</p>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <GoogleG />
            <div>
              <p className="flex items-center gap-2 text-2xl font-bold leading-none text-slate-950">
                {summary.rating.toFixed(1)}
                <Stars rating={summary.rating} />
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Based on {summary.total}+ Google reviews
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {summary.reviews.map((review) => (
            <figure
              key={`${review.author}-${review.relativeTime}`}
              className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <Stars rating={review.rating} />
                <GoogleG />
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                “{review.text}”
              </blockquote>
              <figcaption className="mt-4 border-t border-slate-100 pt-3 text-sm">
                <span className="font-semibold text-slate-900">{review.author}</span>
                <span className="text-slate-500"> · {review.relativeTime}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={summary.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Read all reviews on Google →
          </a>
          <a
            href={`${summary.url}`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Leave us a review
          </a>
        </div>
      </div>
    </section>
  );
}
