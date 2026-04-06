import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSession, deleteSession, getSessionCookieHeader, clearSessionCookieHeader } from "@/lib/auth";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => { throw new Error(`REDIRECT:${url}`); }),
}));

describe("createSession", () => {
  let kv: KVNamespace;
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    kv = {
      put: vi.fn(async (key: string, value: string) => { store.set(key, value); }),
      get: vi.fn(async (key: string) => store.get(key) ?? null),
      delete: vi.fn(async (key: string) => { store.delete(key); }),
      list: vi.fn(),
      getWithMetadata: vi.fn(),
    } as unknown as KVNamespace;
  });

  it("stores session with email and expiry", async () => {
    await createSession(kv, "sid123", "admin@example.com");
    const stored = store.get("sid123");
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!) as { email: string; exp: number };
    expect(parsed.email).toBe("admin@example.com");
    expect(parsed.exp).toBeGreaterThan(Date.now());
  });

  it("deletes session on logout", async () => {
    store.set("sid123", JSON.stringify({ email: "admin@example.com", exp: Date.now() + 1000 }));
    await deleteSession(kv, "sid123");
    expect(store.has("sid123")).toBe(false);
  });
});

describe("cookie header helpers", () => {
  it("getSessionCookieHeader sets HttpOnly and Secure", () => {
    const header = getSessionCookieHeader("mysid");
    expect(header).toContain("mysid");
    expect(header).toContain("HttpOnly");
    expect(header).toContain("Secure");
    expect(header).toContain("SameSite=Lax");
  });

  it("clearSessionCookieHeader sets Max-Age=0", () => {
    const header = clearSessionCookieHeader();
    expect(header).toContain("Max-Age=0");
  });
});
