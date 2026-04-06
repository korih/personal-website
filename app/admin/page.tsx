import Link from "next/link";
import { PenLine, Star, FolderOpen, Plus } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-border rounded-xl p-5 bg-bg-elev">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-fg-muted" />
              <h2 className="font-medium">Blog Posts</h2>
            </div>
            <Link
              href="/admin/posts/new"
              className="text-xs text-fg-muted hover:text-fg transition-colors flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> New
            </Link>
          </div>
          <Link
            href="/admin/posts"
            className="text-sm text-fg-muted hover:text-fg transition-colors"
          >
            Manage posts →
          </Link>
        </div>
        <div className="border border-border rounded-xl p-5 bg-bg-elev">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-fg-muted" />
              <h2 className="font-medium">Reviews</h2>
            </div>
            <Link
              href="/admin/reviews/new"
              className="text-xs text-fg-muted hover:text-fg transition-colors flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> New
            </Link>
          </div>
          <Link
            href="/admin/reviews"
            className="text-sm text-fg-muted hover:text-fg transition-colors"
          >
            Manage reviews →
          </Link>
        </div>
        <div className="border border-border rounded-xl p-5 bg-bg-elev">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-fg-muted" />
              <h2 className="font-medium">Projects</h2>
            </div>
            <Link
              href="/admin/projects/new"
              className="text-xs text-fg-muted hover:text-fg transition-colors flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> New
            </Link>
          </div>
          <Link
            href="/admin/projects"
            className="text-sm text-fg-muted hover:text-fg transition-colors"
          >
            Manage projects →
          </Link>
        </div>
      </div>
    </div>
  );
}
