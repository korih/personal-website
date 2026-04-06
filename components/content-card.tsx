import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  href: string;
  title: string;
  subtitle?: string;
  excerpt?: string | null;
  coverUrl?: string | null;
  meta?: string;
  badge?: string;
  className?: string;
}

export function ContentCard({
  href,
  title,
  subtitle,
  excerpt,
  coverUrl,
  meta,
  badge,
  className,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block border border-border rounded-xl overflow-hidden",
        "hover:border-fg transition-colors bg-bg-elev",
        className
      )}
    >
      {coverUrl && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-fg leading-snug line-clamp-2 group-hover:underline underline-offset-2">
            {title}
          </h3>
          {badge && (
            <span className="text-xs border border-border rounded-full px-2 py-0.5 text-fg-muted shrink-0">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-fg-muted mb-1">{subtitle}</p>}
        {excerpt && (
          <p className="text-sm text-fg-muted line-clamp-2 mt-1">{excerpt}</p>
        )}
        {meta && <p className="text-xs text-fg-muted mt-2">{meta}</p>}
      </div>
    </Link>
  );
}
