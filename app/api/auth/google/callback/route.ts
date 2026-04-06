import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  exchangeCode,
  verifyIdToken,
  consumeOAuthState,
} from "@/lib/google-oauth";
import { createSession, getSessionCookieHeader } from "@/lib/auth";


export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=missing_params", request.url));
  }

  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as {
      SESSIONS: KVNamespace;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      ADMIN_EMAIL: string;
    };

    // Validate state
    const validState = await consumeOAuthState(env.SESSIONS, state);
    if (!validState) {
      return NextResponse.redirect(new URL("/login?error=invalid_state", request.url));
    }

    const origin = url.origin;
    const redirectUri = `${origin}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokens = await exchangeCode(
      code,
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    // Verify ID token
    const payload = await verifyIdToken(tokens.id_token, env.GOOGLE_CLIENT_ID, env.SESSIONS);

    // Check admin email
    if (payload.email !== env.ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
    }

    // Create session
    const sid = nanoid(32);
    await createSession(env.SESSIONS, sid, payload.email);

    const response = NextResponse.redirect(new URL("/admin", request.url));
    response.headers.set("Set-Cookie", getSessionCookieHeader(sid));
    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(new URL("/login?error=server", request.url));
  }
}
