import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { getSessionCookieName } from "@/lib/auth";

async function getAdminEmail(): Promise<string | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { SESSIONS: KVNamespace };
    const cookieStore = await cookies();
    const sid = cookieStore.get(getSessionCookieName())?.value;
    if (!sid) return null;
    const raw = await env.SESSIONS.get(sid);
    if (!raw) return null;
    const session = JSON.parse(raw) as { email: string; exp: number };
    if (session.exp < Date.now()) return null;
    return session.email;
  } catch {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = await getAdminEmail();
  if (!email) redirect("/login");

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/admin"
            className="text-fg-muted hover:text-fg transition-colors px-2 py-1 rounded hover:bg-bg-elev"
          >
            Dashboard
          </Link>
          <span className="text-border">/</span>
          <Link
            href="/admin/posts"
            className="text-fg-muted hover:text-fg transition-colors px-2 py-1 rounded hover:bg-bg-elev"
          >
            Posts
          </Link>
          <span className="text-border">/</span>
          <Link
            href="/admin/reviews"
            className="text-fg-muted hover:text-fg transition-colors px-2 py-1 rounded hover:bg-bg-elev"
          >
            Reviews
          </Link>
          <span className="text-border">/</span>
          <Link
            href="/admin/projects"
            className="text-fg-muted hover:text-fg transition-colors px-2 py-1 rounded hover:bg-bg-elev"
          >
            Projects
          </Link>
        </nav>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="text-xs text-fg-muted hover:text-fg transition-colors px-2 py-1 rounded hover:bg-bg-elev"
          >
            Sign out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
