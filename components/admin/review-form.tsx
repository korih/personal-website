"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "@/components/markdown-editor";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/lib/types";

const MEDIA_TYPES = [
  { value: "movie", label: "Movie" },
  { value: "light_novel", label: "Light Novel" },
  { value: "manga", label: "Manga" },
  { value: "anime", label: "Anime" },
] as const;

interface ReviewFormProps {
  initialData?: {
    id?: string;
    media_type?: MediaType;
    title?: string;
    creator?: string;
    year?: number;
    rating?: number;
    excerpt?: string;
    body_md?: string;
    cover_url?: string;
    published?: boolean;
  };
  mode: "create" | "edit";
}

export function ReviewForm({ initialData, mode }: ReviewFormProps) {
  const router = useRouter();
  const [mediaType, setMediaType] = useState<MediaType>(initialData?.media_type ?? "movie");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [creator, setCreator] = useState(initialData?.creator ?? "");
  const [year, setYear] = useState(initialData?.year?.toString() ?? "");
  const [rating, setRating] = useState(initialData?.rating?.toString() ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [body, setBody] = useState(initialData?.body_md ?? "");
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_url ?? "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleCoverUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = (await res.json()) as { url: string };
      setCoverUrl(url);
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        media_type: mediaType,
        title,
        creator: creator || undefined,
        year: year ? parseInt(year) : undefined,
        rating: rating ? parseFloat(rating) : undefined,
        excerpt: excerpt || undefined,
        body_md: body,
        cover_url: coverUrl || undefined,
        published,
      };
      let res: Response;

      if (mode === "create") {
        res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/reviews/${initialData!.id}`, {
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

      router.push("/admin/reviews");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const creatorLabel = mediaType === "movie" || mediaType === "anime" ? "Director / Studio" : "Author";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5">Media Type *</label>
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value as MediaType)}
          className={cn(
            "w-full bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
          )}
        >
          {MEDIA_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
            placeholder="Title of the work"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{creatorLabel}</label>
          <input
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            className={cn(
              "w-full bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1900"
            max="2100"
            className={cn(
              "w-full bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
            )}
            placeholder="2024"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Rating (0–10)</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="0"
            max="10"
            step="0.5"
            className={cn(
              "w-full bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
            )}
            placeholder="8.5"
          />
        </div>
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
          placeholder="Short summary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Cover image URL</label>
        <div className="flex gap-2">
          <input
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            className={cn(
              "w-full bg-bg-elev border border-border rounded-lg px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
            )}
            placeholder="https://..."
          />
          <label
            className={cn(
              "shrink-0 px-3 py-2 text-sm border border-border rounded-lg cursor-pointer whitespace-nowrap",
              "hover:bg-bg-elev transition-colors",
              uploading && "opacity-50 pointer-events-none"
            )}
          >
            {uploading ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="hidden"
              onChange={(e) => handleCoverUpload(e.target.files?.[0])}
            />
          </label>
        </div>
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt="Cover preview"
            className="mt-2 h-24 rounded-lg border border-border object-cover"
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Review *</label>
        <MarkdownEditor
          value={body}
          onChange={setBody}
          placeholder="Write your review in markdown..."
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
