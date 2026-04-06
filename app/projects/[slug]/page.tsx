import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";
import { Markdown } from "@/components/markdown";
import type { Project } from "@/lib/types";

async function getProject(slug: string): Promise<Project | null> {
  try {
    const { getEnv } = await import("@/lib/cloudflare");
    const { getProjectBySlug } = await import("@/lib/db");
    const env = await getEnv();
    return await getProjectBySlug(env.DB, slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.tagline ?? undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = await getProject((await params).slug);
  if (!project) notFound();

  const tech: string[] = project.tech ? (JSON.parse(project.tech) as string[]) : [];

  return (
    <article className="max-w-2xl py-8">
      {project.cover_url && (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
          <Image src={project.cover_url} alt={project.name} fill className="object-cover" />
        </div>
      )}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">{project.name}</h1>
        {project.tagline && <p className="text-fg-muted">{project.tagline}</p>}
        <div className="flex gap-3 mt-3">
          {project.repo_url && (
            <Link
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors"
            >
              <Github className="h-4 w-4" />
              Source
            </Link>
          )}
          {project.live_url && (
            <Link
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Live
            </Link>
          )}
        </div>
        {tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tech.map((t) => (
              <span
                key={t}
                className="text-xs border border-border rounded-full px-2.5 py-0.5 text-fg-muted"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <Markdown content={project.body_md} />
    </article>
  );
}
