import { NextResponse } from "next/server";
import { z } from "zod";
import { updateReview, deleteReview, getReviewById } from "@/lib/db";
import { verifyAdminSession } from "@/lib/api-auth";


const UpdateReviewSchema = z.object({
  media_type: z.enum(["movie", "light_novel", "manga", "anime"]).optional(),
  title: z.string().min(1).max(200).optional(),
  creator: z.string().max(200).nullable().optional(),
  year: z.number().int().min(1900).max(2100).nullable().optional(),
  rating: z.number().min(0).max(10).nullable().optional(),
  excerpt: z.string().max(500).nullable().optional(),
  body_md: z.string().min(1).optional(),
  cover_url: z.string().url().nullable().optional().or(z.literal("")),
  metadata: z.record(z.unknown()).nullable().optional(),
  published: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { SESSIONS: KVNamespace; DB: D1Database };
    const auth = await verifyAdminSession(env.SESSIONS);
    if (!auth.ok) return auth.response;

    const review = await getReviewById(env.DB, (await params).id);
    if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const data = UpdateReviewSchema.parse(body);

    await updateReview(env.DB, (await params).id, {
      ...data,
      cover_url: data.cover_url === "" ? null : data.cover_url,
      metadata: data.metadata !== undefined
        ? (data.metadata ? JSON.stringify(data.metadata) : null)
        : undefined,
      published: data.published !== undefined ? (data.published ? 1 : 0) : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { SESSIONS: KVNamespace; DB: D1Database };
    const auth = await verifyAdminSession(env.SESSIONS);
    if (!auth.ok) return auth.response;

    await deleteReview(env.DB, (await params).id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
