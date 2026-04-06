import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { slugify } from "@/lib/slug";
import { createPost, listAllPosts } from "@/lib/db";
import { verifyAdminSession } from "@/lib/api-auth";


const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional(),
  body_md: z.string().min(1),
  cover_url: z.string().url().optional().or(z.literal("")),
  published: z.boolean().optional().default(false),
});

export async function GET() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { SESSIONS: KVNamespace; DB: D1Database };
    const auth = await verifyAdminSession(env.SESSIONS);
    if (!auth.ok) return auth.response;

    const posts = await listAllPosts(env.DB);
    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { SESSIONS: KVNamespace; DB: D1Database };
    const auth = await verifyAdminSession(env.SESSIONS);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const data = CreatePostSchema.parse(body);

    const id = nanoid();
    const slug = slugify(data.title);

    await createPost(env.DB, {
      id,
      slug,
      title: data.title,
      excerpt: data.excerpt ?? null,
      body_md: data.body_md,
      cover_url: data.cover_url || null,
      published: data.published ? 1 : 0,
    });

    return NextResponse.json({ id, slug }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
