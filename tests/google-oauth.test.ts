import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildAuthUrl, storeOAuthState, consumeOAuthState } from "@/lib/google-oauth";

describe("buildAuthUrl", () => {
  it("includes required OAuth parameters", () => {
    const url = buildAuthUrl("client123", "https://example.com/callback", "state456");
    const parsed = new URL(url);
    expect(parsed.searchParams.get("client_id")).toBe("client123");
    expect(parsed.searchParams.get("redirect_uri")).toBe("https://example.com/callback");
    expect(parsed.searchParams.get("state")).toBe("state456");
    expect(parsed.searchParams.get("response_type")).toBe("code");
    expect(parsed.searchParams.get("scope")).toContain("openid");
    expect(parsed.searchParams.get("scope")).toContain("email");
  });

  it("points to Google auth endpoint", () => {
    const url = buildAuthUrl("id", "https://example.com/callback", "s");
    expect(url).toContain("accounts.google.com");
  });
});

describe("storeOAuthState / consumeOAuthState", () => {
  let kv: KVNamespace;

  beforeEach(() => {
    const store = new Map<string, string>();
    kv = {
      put: vi.fn(async (key: string, value: string) => { store.set(key, value); }),
      get: vi.fn(async (key: string) => store.get(key) ?? null),
      delete: vi.fn(async (key: string) => { store.delete(key); }),
      list: vi.fn(),
      getWithMetadata: vi.fn(),
    } as unknown as KVNamespace;
  });

  it("stores a state and can consume it once", async () => {
    await storeOAuthState(kv, "teststate");
    const valid = await consumeOAuthState(kv, "teststate");
    expect(valid).toBe(true);
  });

  it("returns false for unknown state", async () => {
    const valid = await consumeOAuthState(kv, "unknown");
    expect(valid).toBe(false);
  });

  it("state is single-use — second consume returns false", async () => {
    await storeOAuthState(kv, "mystate");
    await consumeOAuthState(kv, "mystate");
    const second = await consumeOAuthState(kv, "mystate");
    expect(second).toBe(false);
  });
});
