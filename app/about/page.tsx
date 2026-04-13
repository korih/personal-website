import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "I'm Kori, a software developer based in Vancouver, BC. I studied CS at UBC and work on compilers, systems, and web projects.",
  openGraph: {
    title: "About — Kori H",
    description:
      "I'm Kori, a software developer based in Vancouver, BC. I studied CS at UBC and work on compilers, systems, and web projects.",
    url: "/about",
  },
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
          Outside of code, I read a lot — mostly east asian WebNovels or Warhammer 40k. I also 
          love to watch movies or pretty much anything with a good story I&apos;ve
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
          <a href="https://github.com/korih" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{" "}
          or checkout my{" "}
          <a href="https://anilist.co/user/Skidlez/" target="_blank" rel="noopener noreferrer">
            Anilist!
          </a>{" "}
        </p>
      </div>
    </div>
  );
}
