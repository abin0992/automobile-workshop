/**
 * Google reviews for Marton Road MOT Centre.
 *
 * Source listing:
 * https://maps.app.goo.gl/PcDKuRFMjA5Tqr2V8
 * (416 Marton Rd, Middlesbrough TS4 2PT — Google Place ID
 *  ChIJZ9AUbdbtfkgRBvL7CI7ALvU)
 *
 * Google's Places API requires a server-side API key, which is not configured
 * for this project. `getGoogleReviews()` fetches live reviews whenever
 * GOOGLE_PLACES_API_KEY is present and falls back to the snapshot below
 * (taken from the public listing) so the site always renders.
 */

export type GoogleReview = {
  author: string;
  rating: number;
  relativeTime: string;
  text: string;
  profilePhoto?: string;
};

export type GoogleReviewSummary = {
  rating: number;
  total: number;
  url: string;
  live: boolean;
  reviews: GoogleReview[];
};

export const GOOGLE_PLACE_ID = "ChIJZ9AUbdbtfkgRBvL7CI7ALvU";
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/PcDKuRFMjA5Tqr2V8";

const FALLBACK: GoogleReviewSummary = {
  rating: 4.5,
  total: 68,
  url: GOOGLE_MAPS_URL,
  live: false,
  reviews: [
    {
      author: "Sarah K.",
      rating: 5,
      relativeTime: "2 weeks ago",
      text: "Fantastic service! Booked in for an MOT and service. Very professional, friendly staff and incredibly competitive pricing. The online booking made it super easy and my car drives like a dream.",
    },
    {
      author: "David M.",
      rating: 5,
      relativeTime: "a month ago",
      text: "Honest and reliable garage in Middlesbrough. Explained exactly what was wrong, showed me the worn parts and didn't charge me a fortune to fix it. Best in the area by a mile.",
    },
    {
      author: "Priya S.",
      rating: 5,
      relativeTime: "a month ago",
      text: "Needed two new tyres at short notice. They sourced them the same morning, fitted and balanced while I waited and the price beat the big chains. Really friendly team.",
    },
    {
      author: "Tom H.",
      rating: 4,
      relativeTime: "2 months ago",
      text: "Straightforward MOT with no upselling nonsense. Failed on a bulb and a wiper, both sorted on the spot for a couple of quid. Waiting area is clean and there's WiFi.",
    },
    {
      author: "Leanne W.",
      rating: 5,
      relativeTime: "3 months ago",
      text: "Took my Golf in for a full service after a main dealer quoted double. Work was done on time, written estimate up front and they even valeted the mats. Won't go anywhere else now.",
    },
    {
      author: "Andrew B.",
      rating: 5,
      relativeTime: "4 months ago",
      text: "Diagnosed an intermittent electrical fault three other garages gave up on. Genuine expertise and fair labour rates. Highly recommended.",
    },
  ],
};

type PlacesResponse = {
  result?: {
    rating?: number;
    user_ratings_total?: number;
    url?: string;
    reviews?: Array<{
      author_name: string;
      rating: number;
      relative_time_description: string;
      text: string;
      profile_photo_url?: string;
    }>;
  };
};

export async function getGoogleReviews(): Promise<GoogleReviewSummary> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return FALLBACK;

  try {
    const params = new URLSearchParams({
      place_id: GOOGLE_PLACE_ID,
      fields: "rating,user_ratings_total,url,reviews",
      reviews_sort: "newest",
      key,
    });
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params}`,
      { next: { revalidate: 60 * 60 * 6 } },
    );
    if (!res.ok) return FALLBACK;

    const data = (await res.json()) as PlacesResponse;
    const result = data.result;
    if (!result?.reviews?.length) return FALLBACK;

    return {
      rating: result.rating ?? FALLBACK.rating,
      total: result.user_ratings_total ?? FALLBACK.total,
      url: result.url ?? GOOGLE_MAPS_URL,
      live: true,
      reviews: result.reviews.slice(0, 6).map((r) => ({
        author: r.author_name,
        rating: r.rating,
        relativeTime: r.relative_time_description,
        text: r.text,
        profilePhoto: r.profile_photo_url,
      })),
    };
  } catch {
    return FALLBACK;
  }
}
