import type { Metadata } from "next";
import { ContentCard } from "@/components/content-card";
import type { Post } from "@/lib/types";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing on software engineering, programming tools, and ideas I find worth sharing. Posts on TypeScript, Rust, compilers, and more.",
  openGraph: {
    title: "Blog — Kori H",
    description:
      "Writing on software engineering, programming tools, and ideas I find worth sharing. Posts on TypeScript, Rust, compilers, and more.",
    url: "/blog",
  },
};

async function getPosts(): Promise<Post[]> {
  try {
    const { getEnv } = await import("@/lib/cloudflare");
    const { listPublishedPosts } = await import("@/lib/db");
    const env = await getEnv();
    return await listPublishedPosts(env.DB);
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-fg-muted mb-8">Writing on software, tools, and ideas.</p>
      {posts.length === 0 ? (
        <p className="text-fg-muted">No posts yet — check back soon.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <ContentCard
              key={post.id}
              href={`/blog/${post.slug}`}
              title={post.title}
              excerpt={post.excerpt}
              coverUrl={post.cover_url}
              meta={new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
