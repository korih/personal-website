"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "@/components/markdown-editor";
import { cn } from "@/lib/utils";

interface PostFormProps {
  initialData?: {
    id?: string;
    title?: string;
    excerpt?: string;
    body_md?: string;
    cover_url?: string;
    published?: boolean;
  };
  mode: "create" | "edit";
}

export function PostForm({ initialData, mode }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [body, setBody] = useState(initialData?.body_md ?? "");
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_url ?? "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = { title, excerpt: excerpt || undefined, body_md: body, cover_url: coverUrl || undefined, published };
      let res: Response;

      if (mode === "create") {
        res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/posts/${initialData!.id}`, {
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

      router.push("/admin/posts");
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
        <label className="block text-sm font-medium mb-1.5">Title *</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={cn(
            "w-full bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
          )}
          placeholder="Post title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className={cn(
            "w-full bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm resize-none",
            "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
          )}
          placeholder="Short summary shown in lists"
        />
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
        <label className="block text-sm font-medium mb-1.5">Body *</label>
        <MarkdownEditor
          value={body}
          onChange={setBody}
          placeholder="Write your post in markdown..."
        />
      </div>
      <div className="flex items-center gap-5 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 accent-fg"
          />
          <span className="text-sm">Published</span>
        </label>
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
