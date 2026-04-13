import type { Metadata } from "next";
import { ContentCard } from "@/components/content-card";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Software projects I've built — compilers, web apps, tools, and experiments. Mostly TypeScript, Rust, and Java. Source code on GitHub.",
  openGraph: {
    title: "Projects — Kori H",
    description:
      "Software projects I've built — compilers, web apps, tools, and experiments. Mostly TypeScript, Rust, and Java. Source code on GitHub.",
    url: "/projects",
  },
};

async function getProjects(): Promise<Project[]> {
  try {
    const { getEnv } = await import("@/lib/cloudflare");
    const { listProjects } = await import("@/lib/db");
    const env = await getEnv();
    return await listProjects(env.DB);
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-2">Projects</h1>
      <p className="text-fg-muted mb-8">Things I&apos;ve built.</p>
      {projects.length === 0 ? (
        <p className="text-fg-muted">No projects yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ContentCard
              key={project.id}
              href={`/projects/${project.slug}`}
              title={project.name}
              subtitle={project.tagline ?? undefined}
              coverUrl={project.cover_url}
              badge={
                project.tech
                  ? (JSON.parse(project.tech) as string[])[0]
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
