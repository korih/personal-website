import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import type { Post } from "@/lib/types";

async function getAllPosts(): Promise<Post[]> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { listAllPosts } = await import("@/lib/db");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { DB: D1Database };
    return await listAllPosts(env.DB);
  } catch {
    return [];
  }
}

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Blog Posts</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-fg text-bg rounded-lg hover:opacity-80 transition-opacity"
        >
          <Plus className="h-3.5 w-3.5" /> New Post
        </Link>
      </div>
      {posts.length === 0 ? (
        <p className="text-fg-muted">No posts yet.</p>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elev">
                <th className="text-left px-4 py-2.5 font-medium text-fg-muted">Title</th>
                <th className="text-left px-4 py-2.5 font-medium text-fg-muted hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-2.5 font-medium text-fg-muted hidden sm:table-cell">Date</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0 hover:bg-bg-elev transition-colors">
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${post.published ? "border-green-500/30 text-green-600 dark:text-green-400" : "border-border text-fg-muted"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-fg-muted hidden sm:table-cell">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-fg-muted hover:text-fg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton id={post.id} type="posts" label={post.title} />
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
