import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/admin/review-form";
import type { Review } from "@/lib/types";

async function getReview(id: string): Promise<Review | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { getReviewById } = await import("@/lib/db");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { DB: D1Database };
    return await getReviewById(env.DB, id);
  } catch {
    return null;
  }
}

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const review = await getReview((await params).id);
  if (!review) notFound();

  return (
    <div className="py-4 max-w-4xl">
      <h1 className="text-xl font-bold mb-6">Edit Review</h1>
      <ReviewForm
        mode="edit"
        initialData={{
          id: review.id,
          media_type: review.media_type,
          title: review.title,
          creator: review.creator ?? undefined,
          year: review.year ?? undefined,
          rating: review.rating ?? undefined,
          excerpt: review.excerpt ?? undefined,
          body_md: review.body_md,
          cover_url: review.cover_url ?? undefined,
          published: review.published === 1,
        }}
      />
    </div>
  );
}
