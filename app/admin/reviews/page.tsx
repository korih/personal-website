import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import type { Review } from "@/lib/types";

const MEDIA_LABELS: Record<string, string> = {
  movie: "Movie",
  light_novel: "Light Novel",
  manga: "Manga",
  anime: "Anime",
};

async function getAllReviews(): Promise<Review[]> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { listAllReviews } = await import("@/lib/db");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { DB: D1Database };
    return await listAllReviews(env.DB);
  } catch {
    return [];
  }
}

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Reviews</h1>
        <Link
          href="/admin/reviews/new"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-fg text-bg rounded-lg hover:opacity-80 transition-opacity"
        >
          <Plus className="h-3.5 w-3.5" /> New Review
        </Link>
      </div>
      {reviews.length === 0 ? (
        <p className="text-fg-muted">No reviews yet.</p>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elev">
                <th className="text-left px-4 py-2.5 font-medium text-fg-muted">Title</th>
                <th className="text-left px-4 py-2.5 font-medium text-fg-muted hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-2.5 font-medium text-fg-muted hidden sm:table-cell">Rating</th>
                <th className="text-left px-4 py-2.5 font-medium text-fg-muted hidden sm:table-cell">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-border last:border-0 hover:bg-bg-elev transition-colors">
                  <td className="px-4 py-3 font-medium">{review.title}</td>
                  <td className="px-4 py-3 text-fg-muted hidden sm:table-cell">
                    {MEDIA_LABELS[review.media_type] ?? review.media_type}
                  </td>
                  <td className="px-4 py-3 text-fg-muted hidden sm:table-cell">
                    {review.rating != null ? `${review.rating}/10` : "—"}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${review.published ? "border-green-500/30 text-green-600 dark:text-green-400" : "border-border text-fg-muted"}`}>
                      {review.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/reviews/${review.id}`}
                        className="text-fg-muted hover:text-fg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton id={review.id} type="reviews" label={review.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
