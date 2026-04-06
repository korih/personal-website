import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { slugify } from "@/lib/slug";
import { createReview, listAllReviews } from "@/lib/db";
import { verifyAdminSession } from "@/lib/api-auth";


const CreateReviewSchema = z.object({
  media_type: z.enum(["movie", "light_novel", "manga", "anime"]),
  title: z.string().min(1).max(200),
  creator: z.string().max(200).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  rating: z.number().min(0).max(10).optional(),
  excerpt: z.string().max(500).optional(),
  body_md: z.string().min(1),
  cover_url: z.string().url().optional().or(z.literal("")),
  metadata: z.record(z.unknown()).optional(),
  published: z.boolean().optional().default(false),
});

export async function GET() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { SESSIONS: KVNamespace; DB: D1Database };
    const auth = await verifyAdminSession(env.SESSIONS);
    if (!auth.ok) return auth.response;

    const reviews = await listAllReviews(env.DB);
    return NextResponse.json(reviews);
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
    const data = CreateReviewSchema.parse(body);

    const id = nanoid();
    const slug = slugify(`${data.title}-${data.media_type}`);

    await createReview(env.DB, {
      id,
      slug,
      media_type: data.media_type,
      title: data.title,
      creator: data.creator ?? null,
      year: data.year ?? null,
      rating: data.rating ?? null,
      excerpt: data.excerpt ?? null,
      body_md: data.body_md,
      cover_url: data.cover_url || null,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
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
