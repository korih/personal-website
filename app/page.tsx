import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-fg mb-6">
          Hey, I&apos;m Kori.
        </h1>
        <p className="text-lg text-fg-muted mb-8 leading-relaxed">
          Software developer, avid reader, and outdoor enthusiast. I write about tech, 
          books I&apos;ve been reading, and films worth watching. I mostly work professionally 
          with Java but in my free time I love to work with Rust and Typescript. (I'm lowkey also a 
          lisp fan). I also love garbage reading garbage webnovels online so I spam those often. 
          But I do need to touch grass so i'll be writing about my outdoor adventures too.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-fg text-bg text-sm font-medium hover:bg-fg-muted transition-colors"
          >
            About me <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-fg text-sm font-medium hover:bg-bg-elev transition-colors"
          >
            Read the blog
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-fg text-sm font-medium hover:bg-bg-elev transition-colors"
          >
            Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
