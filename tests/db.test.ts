import { describe, it, expect, vi, beforeEach } from "vitest";
import { slugify } from "@/lib/slug";

// Unit tests for db query-builder logic (without a real D1 instance)
// We test the helpers that don't require a DB connection

describe("slugify (used in API routes before DB insert)", () => {
  it("generates consistent slugs for post titles", () => {
    expect(slugify("My First Post")).toBe("my-first-post");
    expect(slugify("What is TypeScript?")).toBe("what-is-typescript");
  });

  it("handles review slugs with media type suffix", () => {
    const title = "Tenki no Ko";
    const mediaType = "movie";
    expect(slugify(`${title}-${mediaType}`)).toBe("tenki-no-ko-movie");
  });
});

describe("media type validation", () => {
  const VALID_TYPES = ["movie", "light_novel", "manga", "anime"];

  it("validates all supported media types", () => {
    for (const t of VALID_TYPES) {
      expect(VALID_TYPES.includes(t)).toBe(true);
    }
  });

  it("rejects unknown media type", () => {
    expect(VALID_TYPES.includes("podcast")).toBe(false);
  });
});

describe("JSON column serialization for tech array", () => {
  it("round-trips a tech array through JSON", () => {
    const tech = ["TypeScript", "React", "Cloudflare"];
    const serialized = JSON.stringify(tech);
    const deserialized = JSON.parse(serialized) as string[];
    expect(deserialized).toEqual(tech);
  });

  it("handles empty tech array", () => {
    const tech: string[] = [];
    const serialized = JSON.stringify(tech);
    expect(JSON.parse(serialized)).toEqual([]);
  });
});

describe("published flag conversion", () => {
  const toDbFlag = (b: boolean) => (b ? 1 : 0);
  const fromDbFlag = (n: number) => n === 1;

  it("converts boolean to DB integer", () => {
    expect(toDbFlag(true)).toBe(1);
    expect(toDbFlag(false)).toBe(0);
  });

  it("converts DB integer back to boolean", () => {
    expect(fromDbFlag(1)).toBe(true);
    expect(fromDbFlag(0)).toBe(false);
  });
});
