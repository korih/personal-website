import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { getSessionCookieName } from "@/lib/auth";


export async function POST(request: Request) {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as {
      SESSIONS: KVNamespace;
      MEDIA: R2Bucket;
      NEXT_PUBLIC_SITE_URL: string;
    };

    // Auth check
    const cookieStore = await cookies();
    const sid = cookieStore.get(getSessionCookieName())?.value;
    if (!sid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await env.SESSIONS.get(sid);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const key = `inline/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, "0")}/${nanoid()}.${ext}`;

    const buffer = await file.arrayBuffer();
    await env.MEDIA.put(key, buffer, {
      httpMetadata: { contentType: file.type },
    });

    // Return the public URL — adjust if you have a custom domain on R2
    const url = `${env.NEXT_PUBLIC_SITE_URL}/api/media/${encodeURIComponent(key)}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
