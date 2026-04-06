import type { Post, Review, Project } from "@/lib/types";

export interface DBEnv {
  DB: D1Database;
}

// Queries

export async function listPublishedPosts(db: D1Database, limit = 20, offset = 0): Promise<Post[]> {
  const result = await db
    .prepare(
      "SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?"
    )
    .bind(limit, offset)
    .all<Post>();
  return result.results;
}

export async function getPostBySlug(db: D1Database, slug: string): Promise<Post | null> {
  const result = await db
    .prepare("SELECT * FROM posts WHERE slug = ? AND published = 1")
    .bind(slug)
    .first<Post>();
  return result ?? null;
}

export async function getPostById(db: D1Database, id: string): Promise<Post | null> {
  const result = await db
    .prepare("SELECT * FROM posts WHERE id = ?")
    .bind(id)
    .first<Post>();
  return result ?? null;
}

export async function listAllPosts(db: D1Database): Promise<Post[]> {
  const result = await db
    .prepare("SELECT * FROM posts ORDER BY created_at DESC")
    .all<Post>();
  return result.results;
}

export async function createPost(
  db: D1Database,
  post: Omit<Post, "created_at" | "updated_at">
): Promise<void> {
  const now = Date.now();
  await db
    .prepare(
      "INSERT INTO posts (id, slug, title, excerpt, body_md, cover_url, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(
      post.id,
      post.slug,
      post.title,
      post.excerpt ?? null,
      post.body_md,
      post.cover_url ?? null,
      post.published,
      now,
      now
    )
    .run();
}

export async function updatePost(
  db: D1Database,
  id: string,
  data: Partial<Omit<Post, "id" | "created_at" | "updated_at">>
): Promise<void> {
  const fields = Object.keys(data) as (keyof typeof data)[];
  if (fields.length === 0) return;
  const setClauses = fields.map((f) => `${f} = ?`).join(", ");
  const values = fields.map((f) => data[f] ?? null);
  await db
    .prepare(`UPDATE posts SET ${setClauses}, updated_at = ? WHERE id = ?`)
    .bind(...values, Date.now(), id)
    .run();
}

export async function deletePost(db: D1Database, id: string): Promise<void> {
  await db.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
}

// Reviews

export async function listPublishedReviews(
  db: D1Database,
  mediaType?: string,
  limit = 20,
  offset = 0
): Promise<Review[]> {
  if (mediaType) {
    const result = await db
      .prepare(
        "SELECT * FROM reviews WHERE published = 1 AND media_type = ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
      )
      .bind(mediaType, limit, offset)
      .all<Review>();
    return result.results;
  }
  const result = await db
    .prepare(
      "SELECT * FROM reviews WHERE published = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?"
    )
    .bind(limit, offset)
    .all<Review>();
  return result.results;
}

export async function getReviewBySlug(db: D1Database, slug: string): Promise<Review | null> {
  const result = await db
    .prepare("SELECT * FROM reviews WHERE slug = ? AND published = 1")
    .bind(slug)
    .first<Review>();
  return result ?? null;
}

export async function getReviewById(db: D1Database, id: string): Promise<Review | null> {
  const result = await db
    .prepare("SELECT * FROM reviews WHERE id = ?")
    .bind(id)
    .first<Review>();
  return result ?? null;
}

export async function listAllReviews(db: D1Database): Promise<Review[]> {
  const result = await db
    .prepare("SELECT * FROM reviews ORDER BY created_at DESC")
    .all<Review>();
  return result.results;
}

export async function createReview(
  db: D1Database,
  review: Omit<Review, "created_at" | "updated_at">
): Promise<void> {
  const now = Date.now();
  await db
    .prepare(
      "INSERT INTO reviews (id, slug, media_type, title, creator, year, rating, excerpt, body_md, cover_url, metadata, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(
      review.id,
      review.slug,
      review.media_type,
      review.title,
      review.creator ?? null,
      review.year ?? null,
      review.rating ?? null,
      review.excerpt ?? null,
      review.body_md,
      review.cover_url ?? null,
      review.metadata ?? null,
      review.published,
      now,
      now
    )
    .run();
}

export async function updateReview(
  db: D1Database,
  id: string,
  data: Partial<Omit<Review, "id" | "created_at" | "updated_at">>
): Promise<void> {
  const fields = Object.keys(data) as (keyof typeof data)[];
  if (fields.length === 0) return;
  const setClauses = fields.map((f) => `${f} = ?`).join(", ");
  const values = fields.map((f) => data[f] ?? null);
  await db
    .prepare(`UPDATE reviews SET ${setClauses}, updated_at = ? WHERE id = ?`)
    .bind(...values, Date.now(), id)
    .run();
}

export async function deleteReview(db: D1Database, id: string): Promise<void> {
  await db.prepare("DELETE FROM reviews WHERE id = ?").bind(id).run();
}

// Projects

export async function listProjects(db: D1Database): Promise<Project[]> {
  const result = await db
    .prepare("SELECT * FROM projects ORDER BY display_order ASC, created_at DESC")
    .all<Project>();
  return result.results;
}

export async function getProjectBySlug(db: D1Database, slug: string): Promise<Project | null> {
  const result = await db
    .prepare("SELECT * FROM projects WHERE slug = ?")
    .bind(slug)
    .first<Project>();
  return result ?? null;
}

export async function getProjectById(db: D1Database, id: string): Promise<Project | null> {
  const result = await db
    .prepare("SELECT * FROM projects WHERE id = ?")
    .bind(id)
    .first<Project>();
  return result ?? null;
}

export async function createProject(
  db: D1Database,
  project: Omit<Project, "created_at" | "updated_at">
): Promise<void> {
  const now = Date.now();
  await db
    .prepare(
      "INSERT INTO projects (id, slug, name, tagline, body_md, cover_url, repo_url, live_url, tech, display_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(
      project.id,
      project.slug,
      project.name,
      project.tagline ?? null,
      project.body_md,
      project.cover_url ?? null,
      project.repo_url ?? null,
      project.live_url ?? null,
      project.tech ?? null,
      project.display_order,
      now,
      now
    )
    .run();
}

export async function updateProject(
  db: D1Database,
  id: string,
  data: Partial<Omit<Project, "id" | "created_at" | "updated_at">>
): Promise<void> {
  const fields = Object.keys(data) as (keyof typeof data)[];
  if (fields.length === 0) return;
  const setClauses = fields.map((f) => `${f} = ?`).join(", ");
  const values = fields.map((f) => data[f] ?? null);
  await db
    .prepare(`UPDATE projects SET ${setClauses}, updated_at = ? WHERE id = ?`)
    .bind(...values, Date.now(), id)
    .run();
}

export async function deleteProject(db: D1Database, id: string): Promise<void> {
  await db.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
}
