import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import type { Project } from "@/lib/types";

async function getAllProjects(): Promise<Project[]> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { listProjects } = await import("@/lib/db");
    const ctx = await getCloudflareContext({ async: true }); const env = ctx.env as { DB: D1Database };
    return await listProjects(env.DB);
  } catch {
    return [];
  }
}

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-fg text-bg rounded-lg hover:opacity-80 transition-opacity"
        >
          <Plus className="h-3.5 w-3.5" /> New Project
        </Link>
      </div>
      {projects.length === 0 ? (
        <p className="text-fg-muted">No projects yet.</p>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elev">
                <th className="text-left px-4 py-2.5 font-medium text-fg-muted">Name</th>
                <th className="text-left px-4 py-2.5 font-medium text-fg-muted hidden sm:table-cell">Tagline</th>
                <th className="text-left px-4 py-2.5 font-medium text-fg-muted hidden sm:table-cell">Order</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border last:border-0 hover:bg-bg-elev transition-colors">
                  <td className="px-4 py-3 font-medium">{project.name}</td>
                  <td className="px-4 py-3 text-fg-muted hidden sm:table-cell line-clamp-1">
                    {project.tagline ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-fg-muted hidden sm:table-cell">
                    {project.display_order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-fg-muted hover:text-fg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton id={project.id} type="projects" label={project.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
