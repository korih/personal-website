import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { Markdown } from "@/components/markdown";
import type { Review } from "@/lib/types";

const TYPE_MAP: Record<string, string> = {
  movies: "movie",
  "light-novels": "light_novel",
  manga: "manga",
  anime: "anime",
};

async function getReview(type: string, slug: string): Promise<Review | null> {
  const mediaType = TYPE_MAP[type];
  if (!mediaType) return null;
  try {
    const { getEnv } = await import("@/lib/cloudflare");
    const { getReviewBySlug } = await import("@/lib/db");
    const env = await getEnv();
    const review = await getReviewBySlug(env.DB, slug);
    if (review?.media_type !== mediaType) return null;
    return review;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}): Promise<Metadata> {
  const review = await getReview((await params).type, (await params).slug);
  if (!review) return {};
  return {
    title: review.title,
    description: review.excerpt ?? undefined,
  };
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const review = await getReview((await params).type, (await params).slug);
  if (!review) notFound();

  return (
    <article className="max-w-2xl py-8">
      {review.cover_url && (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
          <Image src={review.cover_url} alt={review.title} fill className="object-cover" />
        </div>
      )}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">{review.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-fg-muted">
          {review.creator && <span>{review.creator}</span>}
          {review.year && <span>{review.year}</span>}
          {review.rating != null && (
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              {review.rating}/10
            </span>
          )}
        </div>
      </div>
      <Markdown content={review.body_md} />
    </article>
  );
}
