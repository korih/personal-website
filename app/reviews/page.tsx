import type { Metadata } from "next";
import { ReviewsGrid } from "@/components/reviews-grid";
import type { Review } from "@/lib/types";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "My reviews of movies and light novels — honest takes with ratings. From arthouse films to isekai, if I read or watched it, I wrote about it.",
  openGraph: {
    title: "Reviews — Kori H",
    description:
      "My reviews of movies and light novels — honest takes with ratings. From arthouse films to isekai, if I read or watched it, I wrote about it.",
    url: "/reviews",
  },
};

async function getReviews(): Promise<Review[]> {
  try {
    const { getEnv } = await import("@/lib/cloudflare");
    const { listPublishedReviews } = await import("@/lib/db");
    const env = await getEnv();
    return await listPublishedReviews(env.DB);
  } catch {
    return [];
  }
}

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-2">Reviews</h1>
      <p className="text-fg-muted mb-8">Things I&apos;ve watched and read, with thoughts.</p>
      {reviews.length === 0 ? (
        <p className="text-fg-muted">No reviews yet — check back soon.</p>
      ) : (
        <ReviewsGrid reviews={reviews} />
      )}
    </div>
  );
}
