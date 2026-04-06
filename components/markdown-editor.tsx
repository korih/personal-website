"use client";

import { useRef } from "react";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onImageUpload?: (url: string) => void;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write in markdown...",
  className,
  onImageUpload,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (!onImageUpload) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json() as { url: string };

      // Insert at cursor
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const insertion = `![image](${url})`;
      const newValue = value.slice(0, start) + insertion + value.slice(end);
      onChange(newValue);
      onImageUpload(url);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  return (
    <div className={cn("grid grid-cols-2 gap-4 min-h-[400px]", className)}>
      <div className="flex flex-col">
        <div className="text-xs text-fg-muted mb-1.5 font-medium">Markdown</div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            "flex-1 font-mono text-sm bg-bg-elev border border-border rounded-lg p-3",
            "text-fg placeholder:text-fg-muted",
            "resize-none focus:outline-none focus:ring-2 focus:ring-fg focus:ring-offset-2 focus:ring-offset-bg"
          )}
        />
      </div>
      <div className="flex flex-col">
        <div className="text-xs text-fg-muted mb-1.5 font-medium">Preview</div>
        <div className="flex-1 bg-bg-elev border border-border rounded-lg p-3 overflow-auto">
          {value ? (
            <Markdown content={value} />
          ) : (
            <p className="text-fg-muted text-sm italic">Preview will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
}
