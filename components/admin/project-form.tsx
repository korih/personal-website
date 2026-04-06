"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "@/components/markdown-editor";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ProjectFormProps {
  initialData?: {
    id?: string;
    name?: string;
    tagline?: string;
    body_md?: string;
    cover_url?: string;
    repo_url?: string;
    live_url?: string;
    tech?: string[];
    display_order?: number;
  };
  mode: "create" | "edit";
}

export function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [tagline, setTagline] = useState(initialData?.tagline ?? "");
  const [body, setBody] = useState(initialData?.body_md ?? "");
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_url ?? "");
  const [repoUrl, setRepoUrl] = useState(initialData?.repo_url ?? "");
  const [liveUrl, setLiveUrl] = useState(initialData?.live_url ?? "");
  const [techInput, setTechInput] = useState("");
  const [tech, setTech] = useState<string[]>(initialData?.tech ?? []);
  const [displayOrder, setDisplayOrder] = useState(initialData?.display_order?.toString() ?? "0");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addTech = () => {
    const t = techInput.trim();
    if (t && !tech.includes(t)) {
      setTech([...tech, t]);
      setTechInput("");
    }
  };

  const removeTech = (t: string) => setTech(tech.filter((x) => x !== t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        name,
        tagline: tagline || undefined,
        body_md: body,
        cover_url: coverUrl || undefined,
        repo_url: repoUrl || undefined,
        live_url: liveUrl || undefined,
        tech: tech.length > 0 ? tech : undefined,
        display_order: parseInt(displayOrder) || 0,
      };
      let res: Response;

      if (mode === "create") {
        res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/projects/${initialData!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json() as { error: unknown };
        setError(typeof data.error === "string" ? data.error : "Save failed");
        return;
      }

      router.push("/admin/projects");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5">Name *</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={cn(
            "w-full bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
          )}
          placeholder="Project name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Tagline</label>
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className={cn(
            "w-full bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
          )}
          placeholder="One-line description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">GitHub URL</label>
          <input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className={cn(
              "w-full bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
            )}
            placeholder="https://github.com/..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Live URL</label>
          <input
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            className={cn(
              "w-full bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
            )}
            placeholder="https://..."
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Cover image URL</label>
        <input
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          className={cn(
            "w-full bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
          )}
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Technologies</label>
        <div className="flex gap-2 mb-2">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addTech(); }
            }}
            className={cn(
              "flex-1 bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
            )}
            placeholder="TypeScript, React, ... (Enter to add)"
          />
          <button
            type="button"
            onClick={addTech}
            className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-bg-elev transition-colors"
          >
            Add
          </button>
        </div>
        {tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tech.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 text-xs border border-border rounded-full px-2.5 py-0.5 bg-bg-elev"
              >
                {t}
                <button
                  type="button"
                  onClick={() => removeTech(t)}
                  className="text-fg-muted hover:text-fg transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="w-24">
        <label className="block text-sm font-medium mb-1.5">Display Order</label>
        <input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          className={cn(
            "w-full bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
          )}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Description *</label>
        <MarkdownEditor
          value={body}
          onChange={setBody}
          placeholder="Describe your project..."
        />
      </div>
      <div className="flex items-center gap-5 pt-2">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="ml-auto flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-bg-elev transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm bg-fg text-bg rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
