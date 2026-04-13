import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Markdown } from "@/components/markdown";
import type { Post } from "@/lib/types";

async function getPost(slug: string): Promise<Post | null> {
  try {
    const { getEnv } = await import("@/lib/cloudflare");
    const { getPostBySlug } = await import("@/lib/db");
    const env = await getEnv();
    return await getPostBySlug(env.DB, slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `/blog/${slug}`,
      type: "article",
      ...(post.cover_url ? { images: [{ url: post.cover_url }] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  return (
    <article className="max-w-2xl py-8">
      {post.cover_url && (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
          <Image src={post.cover_url} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <time className="text-sm text-fg-muted">
          {new Date(post.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
      <Markdown content={post.body_md} />
    </article>
  );
}
