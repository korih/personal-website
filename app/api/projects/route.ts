import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { slugify } from "@/lib/slug";
import { createProject, listProjects } from "@/lib/db";
import { verifyAdminSession } from "@/lib/api-auth";


const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  tagline: z.string().max(300).optional(),
  body_md: z.string().min(1),
  cover_url: z.string().url().optional().or(z.literal("")),
  repo_url: z.string().url().optional().or(z.literal("")),
  live_url: z.string().url().optional().or(z.literal("")),
  tech: z.array(z.string()).optional(),
  display_order: z.number().int().optional().default(0),
});

export async function GET() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { SESSIONS: KVNamespace; DB: D1Database };
    const auth = await verifyAdminSession(env.SESSIONS);
    if (!auth.ok) return auth.response;

    const projects = await listProjects(env.DB);
    return NextResponse.json(projects);
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
    const data = CreateProjectSchema.parse(body);

    const id = nanoid();
    const slug = slugify(data.name);

    await createProject(env.DB, {
      id,
      slug,
      name: data.name,
      tagline: data.tagline ?? null,
      body_md: data.body_md,
      cover_url: data.cover_url || null,
      repo_url: data.repo_url || null,
      live_url: data.live_url || null,
      tech: data.tech ? JSON.stringify(data.tech) : null,
      display_order: data.display_order ?? 0,
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
