"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  id: string;
  type: "posts" | "reviews" | "projects";
  label: string;
}

export function DeleteButton({ id, type, label }: DeleteButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/${type}/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <span className="flex items-center gap-1 text-xs">
        <span className="text-fg-muted">Delete &ldquo;{label}&rdquo;?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          {deleting ? "…" : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-fg-muted hover:text-fg transition-colors"
        >
          No
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-fg-muted hover:text-red-500 transition-colors"
      aria-label={`Delete ${label}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
