import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { buildAuthUrl, storeOAuthState } from "@/lib/google-oauth";


export async function GET(request: Request) {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as {
      SESSIONS: KVNamespace;
      GOOGLE_CLIENT_ID: string;
    };

    const origin = new URL(request.url).origin;
    const redirectUri = `${origin}/api/auth/google/callback`;
    const state = nanoid(32);

    await storeOAuthState(env.SESSIONS, state);

    const authUrl = buildAuthUrl(env.GOOGLE_CLIENT_ID, redirectUri, state);
    return NextResponse.redirect(authUrl);
  } catch (err) {
    console.error("OAuth start error:", err);
    return NextResponse.redirect(new URL("/login?error=server", request.url));
  }
}
