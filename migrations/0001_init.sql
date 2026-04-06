CREATE TABLE IF NOT EXISTS posts (
  id           TEXT PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  excerpt      TEXT,
  body_md      TEXT NOT NULL,
  cover_url    TEXT,
  published    INTEGER NOT NULL DEFAULT 0,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_posts_published_created ON posts(published, created_at DESC);

CREATE TABLE IF NOT EXISTS reviews (
  id           TEXT PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  media_type   TEXT NOT NULL,
  title        TEXT NOT NULL,
  creator      TEXT,
  year         INTEGER,
  rating       REAL,
  excerpt      TEXT,
  body_md      TEXT NOT NULL,
  cover_url    TEXT,
  metadata     TEXT,
  published    INTEGER NOT NULL DEFAULT 0,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reviews_type_published ON reviews(media_type, published, created_at DESC);

CREATE TABLE IF NOT EXISTS projects (
  id           TEXT PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  tagline      TEXT,
  body_md      TEXT NOT NULL,
  cover_url    TEXT,
  repo_url     TEXT,
  live_url     TEXT,
  tech         TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
);
