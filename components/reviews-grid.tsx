"use client";

import { useState } from "react";
import { ContentCard } from "@/components/content-card";
import { cn } from "@/lib/utils";
import type { MediaType, Review } from "@/lib/types";

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

const FILTERS = ["all", "movie", "light_novel", "manga", "anime"] as const;
type Filter = (typeof FILTERS)[number];

export function ReviewsGrid({ reviews }: { reviews: Review[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.media_type === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "text-sm rounded-full px-3 py-1 border transition-colors",
              filter === f
                ? "bg-fg text-bg border-fg"
                : "border-border text-fg-muted hover:border-fg hover:text-fg"
            )}
          >
            {f === "all" ? "All" : REVIEW_TYPE_LABELS[f]}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-fg-muted">No reviews match this filter.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((review) => (
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
