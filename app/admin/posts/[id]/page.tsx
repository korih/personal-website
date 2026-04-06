import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import type { Post } from "@/lib/types";

async function getPost(id: string): Promise<Post | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { getPostById } = await import("@/lib/db");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { DB: D1Database };
    return await getPostById(env.DB, id);
  } catch {
    return null;
  }
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const post = await getPost((await params).id);
  if (!post) notFound();

  return (
    <div className="py-4 max-w-4xl">
      <h1 className="text-xl font-bold mb-6">Edit Post</h1>
      <PostForm
        mode="edit"
        initialData={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt ?? undefined,
          body_md: post.body_md,
          cover_url: post.cover_url ?? undefined,
          published: post.published === 1,
        }}
      />
    </div>
  );
}
