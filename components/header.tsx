"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/reviews", label: "Reviews" },
  { href: "/projects", label: "Projects" },
];

export function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/80 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-fg hover:text-fg-muted transition-colors shrink-0"
        >
          kori
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                pathname.startsWith(href)
                  ? "text-fg font-medium"
                  : "text-fg-muted hover:text-fg hover:bg-bg-elev"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <span className="text-xs text-fg-muted border border-border px-2 py-0.5 rounded-full">
              admin
            </span>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden border-t border-border px-4 py-2 flex gap-1 overflow-x-auto">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors",
              pathname.startsWith(href)
                ? "text-fg font-medium"
                : "text-fg-muted hover:text-fg hover:bg-bg-elev"
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </header>
  );
}
