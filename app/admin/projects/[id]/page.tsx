import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import type { Project } from "@/lib/types";

async function getProject(id: string): Promise<Project | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { getProjectById } = await import("@/lib/db");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { DB: D1Database };
    return await getProjectById(env.DB, id);
  } catch {
    return null;
  }
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const project = await getProject((await params).id);
  if (!project) notFound();

  const tech: string[] = project.tech ? (JSON.parse(project.tech) as string[]) : [];

  return (
    <div className="py-4 max-w-4xl">
      <h1 className="text-xl font-bold mb-6">Edit Project</h1>
      <ProjectForm
        mode="edit"
        initialData={{
          id: project.id,
          name: project.name,
          tagline: project.tagline ?? undefined,
          body_md: project.body_md,
          cover_url: project.cover_url ?? undefined,
          repo_url: project.repo_url ?? undefined,
          live_url: project.live_url ?? undefined,
          tech,
          display_order: project.display_order,
        }}
      />
    </div>
  );
}
