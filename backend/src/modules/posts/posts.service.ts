/**
 * Posts Service
 */

import { PostsRepository } from "./posts.repository";
import { generateId, generateSlug } from "@/shared/utils/id";

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  published: boolean;
}

export interface PostDetail extends PostSummary {
  content: string;
}

export class PostsService {
  constructor(private readonly repo: PostsRepository) {}

  // ── Public ────────────────────────────────

  getPublishedPosts(page = 1, limit = 10, tag?: string): { posts: PostSummary[]; total: number } {
    const result = this.repo.getPublishedPosts(page, limit, tag);
    return {
      posts: result.posts.map((p) => this._toSummary(p, this.repo.getPostTags(p.id))),
      total: result.total,
    };
  }

  getAllTags(): string[] {
    return this.repo.getAllTags();
  }

  getPublishedPostBySlug(slug: string): PostDetail | null {
    const post = this.repo.getPublishedPostBySlug(slug);
    if (!post) return null;
    return this._toDetail(post, this.repo.getPostTags(post.id));
  }

  // ── Admin ─────────────────────────────────

  getAllPosts(): PostSummary[] {
    return this.repo.getAllPosts().map((p) =>
      this._toSummary(p, this.repo.getPostTags(p.id))
    );
  }

  getPostById(id: string): PostDetail | null {
    const post = this.repo.getPostById(id);
    if (!post) return null;
    return this._toDetail(post, this.repo.getPostTags(post.id));
  }

  createPost(data: {
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    tags: string[];
    published?: boolean;
    slug?: string;
  }): PostDetail {
    const id = generateId();
    const slug = data.slug ?? generateSlug(data.title);

    if (this.repo.slugExists(slug)) {
      throw new Error(`Slug "${slug}" sudah digunakan`);
    }

    this.repo.createPost(
      {
        id,
        slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        date: data.date,
        read_time: data.readTime,
        published: data.published ? 1 : 0,
      },
      data.tags
    );

    return this._toDetail(
      { id, slug, title: data.title, excerpt: data.excerpt, content: data.content,
        date: data.date, read_time: data.readTime, published: data.published ? 1 : 0,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      data.tags
    );
  }

  updatePost(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      date: string;
      readTime: string;
      tags: string[];
      published: boolean;
    }>
  ): PostDetail | null {
    const existing = this.repo.getPostById(id);
    if (!existing) return null;

    if (data.slug && data.slug !== existing.slug) {
      if (this.repo.slugExists(data.slug, id)) {
        throw new Error(`Slug "${data.slug}" sudah digunakan`);
      }
    }

    const dbData: Record<string, unknown> = {};
    if (data.title !== undefined) dbData.title = data.title;
    if (data.slug !== undefined) dbData.slug = data.slug;
    if (data.excerpt !== undefined) dbData.excerpt = data.excerpt;
    if (data.content !== undefined) dbData.content = data.content;
    if (data.date !== undefined) dbData.date = data.date;
    if (data.readTime !== undefined) dbData.read_time = data.readTime;
    if (data.published !== undefined) dbData.published = data.published ? 1 : 0;

    this.repo.updatePost(id, dbData, data.tags);
    return this.getPostById(id);
  }

  deletePost(id: string): boolean {
    const existing = this.repo.getPostById(id);
    if (!existing) return false;
    this.repo.deletePost(id);
    return true;
  }

  // ── Helpers ───────────────────────────────

  private _toSummary(
    row: { id: string; slug: string; title: string; excerpt: string; date: string; read_time: string; published: number },
    tags: string[]
  ): PostSummary {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      date: row.date,
      readTime: row.read_time,
      tags,
      published: row.published === 1,
    };
  }

  private _toDetail(
    row: { id: string; slug: string; title: string; excerpt: string; content: string; date: string; read_time: string; published: number },
    tags: string[]
  ): PostDetail {
    return { ...this._toSummary(row, tags), content: row.content };
  }
}
