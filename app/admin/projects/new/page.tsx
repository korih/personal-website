import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="py-4 max-w-4xl">
      <h1 className="text-xl font-bold mb-6">New Project</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
