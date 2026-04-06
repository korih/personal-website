import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Markdown } from "@/components/markdown";
import { ContentCard } from "@/components/content-card";

// Mock next/image for test environment
vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}));

// Mock next/link for test environment
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Markdown component", () => {
  it("renders plain text", () => {
    render(<Markdown content="Hello world" />);
    expect(screen.getByText("Hello world")).toBeTruthy();
  });

  it("renders heading markdown", () => {
    render(<Markdown content="# Title" />);
    expect(screen.getByRole("heading", { level: 1, name: "Title" })).toBeTruthy();
  });

  it("renders bold text", () => {
    render(<Markdown content="**bold text**" />);
    expect(screen.getByText("bold text")).toBeTruthy();
  });

  it("sanitizes dangerous HTML", () => {
    render(<Markdown content='<script>alert("xss")</script>' />);
    expect(document.querySelector("script")).toBeNull();
  });

  it("renders links", () => {
    render(<Markdown content="[click here](https://example.com)" />);
    expect(screen.getByRole("link", { name: "click here" })).toBeTruthy();
  });
});

describe("ContentCard component", () => {
  it("renders title and excerpt", () => {
    render(
      <ContentCard
        href="/blog/test"
        title="Test Post"
        excerpt="This is a test excerpt."
      />
    );
    expect(screen.getByText("Test Post")).toBeTruthy();
    expect(screen.getByText("This is a test excerpt.")).toBeTruthy();
  });

  it("renders badge when provided", () => {
    render(<ContentCard href="/reviews/movie/test" title="Test Movie" badge="8.5/10" />);
    expect(screen.getByText("8.5/10")).toBeTruthy();
  });

  it("renders subtitle when provided", () => {
    render(<ContentCard href="/reviews/movie/test" title="Test Movie" subtitle="Some Director" />);
    expect(screen.getByText("Some Director")).toBeTruthy();
  });

  it("links to the correct href", () => {
    render(<ContentCard href="/blog/my-post" title="My Post" />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/blog/my-post");
  });

  it("does not render image when no coverUrl", () => {
    render(<ContentCard href="/blog/test" title="No Cover" />);
    expect(document.querySelector("img")).toBeNull();
  });
});
