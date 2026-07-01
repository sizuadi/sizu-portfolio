-- ============================================================
-- Sizu Portfolio Database Schema
-- Database: SQLite (via Bun's built-in bun:sqlite)
-- ============================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ─────────────────────────────────────────
-- AUTH
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,      -- argon2id hash
  role        TEXT NOT NULL DEFAULT 'admin',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT UNIQUE NOT NULL,  -- SHA-256 hash of the actual token
  expires_at  TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  revoked     INTEGER NOT NULL DEFAULT 0
);

-- ─────────────────────────────────────────
-- PORTFOLIO CONTENT
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS portfolio_meta (
  id          INTEGER PRIMARY KEY DEFAULT 1,  -- singleton row
  name        TEXT NOT NULL,
  title       TEXT NOT NULL,
  tagline     TEXT NOT NULL,
  email       TEXT NOT NULL,
  resume_link TEXT NOT NULL DEFAULT '',
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK (id = 1)  -- enforce singleton
);

CREATE TABLE IF NOT EXISTS about_paragraphs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  content     TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT UNIQUE NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS experiences (
  id          TEXT PRIMARY KEY,
  role        TEXT NOT NULL,
  company     TEXT NOT NULL,
  period      TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS experience_impacts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  experience_id TEXT NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  content       TEXT NOT NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS experience_techs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  experience_id TEXT NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS educations (
  id          TEXT PRIMARY KEY,
  degree      TEXT NOT NULL,
  institution TEXT NOT NULL,
  period      TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS education_achievements (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  education_id TEXT NOT NULL REFERENCES educations(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  image       TEXT NOT NULL DEFAULT '',
  link        TEXT,
  github      TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS project_techs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS project_highlights (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS socials (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  label      TEXT NOT NULL,
  url        TEXT NOT NULL,
  icon       TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ─────────────────────────────────────────
-- BLOG POSTS
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  excerpt     TEXT NOT NULL DEFAULT '',
  content     TEXT NOT NULL DEFAULT '',
  date        TEXT NOT NULL DEFAULT (date('now')),
  read_time   TEXT NOT NULL DEFAULT '5 min',
  published   INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS post_tags (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag     TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
