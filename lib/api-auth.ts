import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionCookieName } from "@/lib/auth";

export async function verifyAdminSession(kv: KVNamespace): Promise<
  | { ok: true; email: string }
  | { ok: false; response: NextResponse }
> {
  const cookieStore = await cookies();
  const sid = cookieStore.get(getSessionCookieName())?.value;
  if (!sid) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const raw = await kv.get(sid);
  if (!raw) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  try {
    const session = JSON.parse(raw) as { email: string; exp: number };
    if (session.exp < Date.now()) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Session expired" }, { status: 401 }),
      };
    }
    return { ok: true, email: session.email };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid session" }, { status: 401 }),
    };
  }
}
