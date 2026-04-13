import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "I'm Kori, a software developer. I studied CS and work on compilers, systems, and web projects.",
  openGraph: {
    title: "About — Kori H",
    description:
      "I'm Kori, a software developer. I studied CS and work on compilers, systems, and web projects.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">About</h1>
      <div className="prose-content">
        <p>
          I&apos;m a software developer based in Canada. I studied Computer Science 
          and have spent a lot of time thinking about compilers, systems programming, and how
          to build things that actually work. I love thinking about efficiencies and correctness
          in programming and I try to apply that to everything I do.
        </p>
        <p>
          Outside of code, I read a lot — mostly east asian WebNovels or Warhammer 40k. I also 
          love to watch movies or pretty much anything with a good story I&apos;ve
          built this site to write about things that interest me without the constraints of a
          platform.
        </p>
        <h2>Some socials</h2>
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
