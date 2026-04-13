import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ContentCard } from "@/components/content-card";
import type { Review } from "@/lib/types";

export const metadata: Metadata = {
  title: "Light Novel Reviews",
  description:
    "Light novel reviews and recommendations with ratings. Covering isekai, fantasy, romance, and everything in between — honest takes from an avid reader.",
  openGraph: {
    title: "Light Novel Reviews — Kori H",
    description:
      "Light novel reviews and recommendations with ratings. Covering isekai, fantasy, romance, and everything in between — honest takes from an avid reader.",
    url: "/reviews/light-novels",
  },
};

async function getLNReviews(): Promise<Review[]> {
  try {
    const { getEnv } = await import("@/lib/cloudflare");
    const { listPublishedReviews } = await import("@/lib/db");
    const env = await getEnv();
    return await listPublishedReviews(env.DB, "light_novel");
  } catch {
    return [];
  }
}

export default async function LightNovelReviewsPage() {
  const reviews = await getLNReviews();

  return (
    <div className="py-8">
      <Link
        href="/reviews"
        className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Reviews
      </Link>
      <h1 className="text-3xl font-bold mb-2">Light Novel Reviews</h1>
      <p className="text-fg-muted mb-8">Light novels I&apos;ve read and recommend.</p>
      {reviews.length === 0 ? (
        <p className="text-fg-muted">No reviews yet — check back soon.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ContentCard
              key={review.id}
              href={`/reviews/light-novels/${review.slug}`}
              title={review.title}
              subtitle={review.creator ?? undefined}
              excerpt={review.excerpt}
              coverUrl={review.cover_url}
              badge={review.rating ? `${review.rating}/10` : undefined}
              meta={review.year?.toString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
