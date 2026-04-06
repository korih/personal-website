export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body_md: string;
  cover_url: string | null;
  published: number;
  created_at: number;
  updated_at: number;
}

export type MediaType = "movie" | "light_novel" | "manga" | "anime";

export interface Review {
  id: string;
  slug: string;
  media_type: MediaType;
  title: string;
  creator: string | null;
  year: number | null;
  rating: number | null;
  excerpt: string | null;
  body_md: string;
  cover_url: string | null;
  metadata: string | null;
  published: number;
  created_at: number;
  updated_at: number;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  body_md: string;
  cover_url: string | null;
  repo_url: string | null;
  live_url: string | null;
  tech: string | null;
  display_order: number;
  created_at: number;
  updated_at: number;
}

export interface Session {
  email: string;
  exp: number;
}
