import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Session } from "@/lib/types";

const COOKIE_NAME = "sid";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days in seconds

export interface AuthEnv {
  SESSIONS: KVNamespace;
  ADMIN_EMAIL: string;
}

export async function getSession(kv: KVNamespace): Promise<Session | null> {
  const cookieStore = await cookies();
  const sid = cookieStore.get(COOKIE_NAME)?.value;
  if (!sid) return null;

  const raw = await kv.get(sid);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as Session;
    if (session.exp < Date.now()) {
      await kv.delete(sid);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function requireAdmin(kv: KVNamespace): Promise<Session> {
  const session = await getSession(kv);
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function createSession(
  kv: KVNamespace,
  sid: string,
  email: string
): Promise<void> {
  const session: Session = {
    email,
    exp: Date.now() + SESSION_TTL * 1000,
  };
  await kv.put(sid, JSON.stringify(session), { expirationTtl: SESSION_TTL });
}

export async function deleteSession(kv: KVNamespace, sid: string): Promise<void> {
  await kv.delete(sid);
}

export function getSessionCookieHeader(sid: string): string {
  return `${COOKIE_NAME}=${sid}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL}`;
}

export function clearSessionCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}
