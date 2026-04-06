import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About me.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">About</h1>
      <div className="prose-content">
        <p>
          I&apos;m a software developer based in Vancouver, BC. I studied Computer Science at UBC
          and have spent a lot of time thinking about compilers, systems programming, and how
          to build things that actually work.
        </p>
        <p>
          Outside of code, I read a lot — mostly light novels and the occasional film. I&apos;ve
          built this site to write about things that interest me without the constraints of a
          platform.
        </p>
        <h2>What I work with</h2>
        <ul>
          <li>Languages: TypeScript, Go, Rust, Java, Python</li>
          <li>Frontend: React, Next.js, Tailwind CSS</li>
          <li>Infrastructure: Cloudflare, PostgreSQL, SQLite</li>
        </ul>
        <h2>Get in touch</h2>
        <p>
          Find me on{" "}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{" "}
          or reach out by email.
        </p>
      </div>
    </div>
  );
}
