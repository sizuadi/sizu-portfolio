/**
 * Posts Repository
 */

import { db } from "@/shared/database/client";

export interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  read_time: string;
  published: number;
  created_at: string;
  updated_at: string;
}

export interface PostListRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  read_time: string;
  published: number;
}

export class PostsRepository {
  // ── Read ──────────────────────────────────

  /** Public: hanya yang published */
  getPublishedPosts(): PostListRow[] {
    return db.query<PostListRow, []>(
      `SELECT id, slug, title, excerpt, date, read_time, published
       FROM posts WHERE published = 1
       ORDER BY date DESC`
    ).all();
  }

  /** Admin: semua post */
  getAllPosts(): PostListRow[] {
    return db.query<PostListRow, []>(
      `SELECT id, slug, title, excerpt, date, read_time, published
       FROM posts ORDER BY date DESC`
    ).all();
  }

  getPostBySlug(slug: string, publishedOnly: boolean = true): PostRow | null {
    const query = publishedOnly
      ? "SELECT * FROM posts WHERE slug = ? AND published = 1"
      : "SELECT * FROM posts WHERE slug = ?";
    return db.query<PostRow, [string]>(query).get(slug);
  }

  getPostById(id: string): PostRow | null {
    return db.query<PostRow, [string]>("SELECT * FROM posts WHERE id = ?").get(id);
  }

  getPostTags(postId: string): string[] {
    return db.query<{ tag: string }, [string]>(
      "SELECT tag FROM post_tags WHERE post_id = ? ORDER BY rowid ASC"
    ).all(postId).map((r) => r.tag);
  }

  slugExists(slug: string, excludeId?: string): boolean {
    if (excludeId) {
      return !!db.query<{ id: string }, [string, string]>(
        "SELECT id FROM posts WHERE slug = ? AND id != ?"
      ).get(slug, excludeId);
    }
    return !!db.query<{ id: string }, [string]>(
      "SELECT id FROM posts WHERE slug = ?"
    ).get(slug);
  }

  // ── Write ─────────────────────────────────

  createPost(data: Omit<PostRow, "created_at" | "updated_at">, tags: string[]): void {
    db.transaction(() => {
      db.run(
        `INSERT INTO posts (id, slug, title, excerpt, content, date, read_time, published)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.id, data.slug, data.title, data.excerpt, data.content, data.date, data.read_time, data.published]
      );
      this._replaceTags(data.id, tags);
    })();
  }

  updatePost(
    id: string,
    data: Partial<Omit<PostRow, "id" | "created_at" | "updated_at">>,
    tags?: string[]
  ): void {
    db.transaction(() => {
      if (Object.keys(data).length > 0) {
        const colMap: Record<string, string> = { readTime: "read_time" };
        const fields = Object.keys(data)
          .map((k) => `${colMap[k] ?? k} = ?`)
          .join(", ");
        const values = [...Object.values(data), id];
        db.run(`UPDATE posts SET ${fields}, updated_at = datetime('now') WHERE id = ?`, values);
      }
      if (tags !== undefined) this._replaceTags(id, tags);
    })();
  }

  deletePost(id: string): void {
    db.run("DELETE FROM posts WHERE id = ?", [id]);
  }

  private _replaceTags(postId: string, tags: string[]): void {
    db.run("DELETE FROM post_tags WHERE post_id = ?", [postId]);
    tags.forEach((tag) => {
      db.run("INSERT INTO post_tags (post_id, tag) VALUES (?, ?)", [postId, tag]);
    });
  }
}
