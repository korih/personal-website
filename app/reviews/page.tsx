import type { Metadata } from "next";
import { ContentCard } from "@/components/content-card";
import type { MediaType, Review } from "@/lib/types";

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

const REVIEW_TYPE_LABELS = {
  movie: "Movie",
  light_novel: "Light Novel",
  manga: "Manga",
  anime: "Anime",
} satisfies Record<MediaType, string>;

const REVIEW_TYPE_PATHS = {
  movie: "movies",
  light_novel: "light-novels",
  manga: "manga",
  anime: "anime",
} satisfies Record<MediaType, string>;

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ContentCard
              key={review.id}
              href={`/reviews/${REVIEW_TYPE_PATHS[review.media_type]}/${review.slug}`}
              title={review.title}
              subtitle={review.creator ?? undefined}
              excerpt={review.excerpt}
              coverUrl={review.cover_url}
              badge={review.rating ? `${review.rating}/10` : undefined}
              meta={review.year?.toString()}
              tags={[REVIEW_TYPE_LABELS[review.media_type]]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
