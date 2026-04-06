import { NextResponse } from "next/server";
import { z } from "zod";
import { updateProject, deleteProject, getProjectById } from "@/lib/db";
import { verifyAdminSession } from "@/lib/api-auth";


const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  tagline: z.string().max(300).nullable().optional(),
  body_md: z.string().min(1).optional(),
  cover_url: z.string().url().nullable().optional().or(z.literal("")),
  repo_url: z.string().url().nullable().optional().or(z.literal("")),
  live_url: z.string().url().nullable().optional().or(z.literal("")),
  tech: z.array(z.string()).nullable().optional(),
  display_order: z.number().int().optional(),
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

    const project = await getProjectById(env.DB, (await params).id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const data = UpdateProjectSchema.parse(body);

    await updateProject(env.DB, (await params).id, {
      ...data,
      cover_url: data.cover_url === "" ? null : data.cover_url,
      repo_url: data.repo_url === "" ? null : data.repo_url,
      live_url: data.live_url === "" ? null : data.live_url,
      tech: data.tech !== undefined
        ? (data.tech ? JSON.stringify(data.tech) : null)
        : undefined,
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

    await deleteProject(env.DB, (await params).id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
