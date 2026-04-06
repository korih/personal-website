import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession, clearSessionCookieHeader, getSessionCookieName } from "@/lib/auth";


export async function POST(request: Request) {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { SESSIONS: KVNamespace };

    const cookieStore = await cookies();
    const sid = cookieStore.get(getSessionCookieName())?.value;
    if (sid) {
      await deleteSession(env.SESSIONS, sid);
    }

    const response = NextResponse.redirect(new URL("/", request.url));
    response.headers.set("Set-Cookie", clearSessionCookieHeader());
    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
