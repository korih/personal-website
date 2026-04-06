import { NextResponse } from "next/server";
import { z } from "zod";
import { updatePost, deletePost, getPostById } from "@/lib/db";
import { verifyAdminSession } from "@/lib/api-auth";


const UpdatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  excerpt: z.string().max(500).nullable().optional(),
  body_md: z.string().min(1).optional(),
  cover_url: z.string().url().nullable().optional().or(z.literal("")),
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

    const post = await getPostById(env.DB, (await params).id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const data = UpdatePostSchema.parse(body);

    await updatePost(env.DB, (await params).id, {
      ...data,
      cover_url: data.cover_url === "" ? null : data.cover_url,
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

    await deletePost(env.DB, (await params).id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
