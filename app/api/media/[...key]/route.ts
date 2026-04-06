import { NextResponse } from "next/server";


export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { MEDIA: R2Bucket };

    const key = (await params).key.join("/");
    const object = await env.MEDIA.get(key);
    if (!object) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(object.body as ReadableStream, { headers });
  } catch (err) {
    console.error("Media proxy error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
