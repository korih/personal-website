import type { Metadata } from "next";
import Link from "next/link";
import { Film, BookOpen } from "lucide-react";

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

export default function ReviewsPage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-2">Reviews</h1>
      <p className="text-fg-muted mb-8">Things I&apos;ve watched and read, with thoughts.</p>
      <div className="grid gap-4 sm:grid-cols-2 max-w-lg">
        <Link
          href="/reviews/movies"
          className="flex items-start gap-4 p-5 border border-border rounded-xl hover:border-fg hover:bg-bg-elev transition-colors group"
        >
          <Film className="h-6 w-6 text-fg-muted shrink-0 mt-0.5 group-hover:text-fg transition-colors" />
          <div>
            <h2 className="font-semibold mb-1">Movies</h2>
            <p className="text-sm text-fg-muted">Film reviews and ratings.</p>
          </div>
        </Link>
        <Link
          href="/reviews/light-novels"
          className="flex items-start gap-4 p-5 border border-border rounded-xl hover:border-fg hover:bg-bg-elev transition-colors group"
        >
          <BookOpen className="h-6 w-6 text-fg-muted shrink-0 mt-0.5 group-hover:text-fg transition-colors" />
          <div>
            <h2 className="font-semibold mb-1">Light Novels</h2>
            <p className="text-sm text-fg-muted">LN reviews and recommendations.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
