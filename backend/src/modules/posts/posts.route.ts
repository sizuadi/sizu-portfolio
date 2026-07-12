/**
 * Posts Routes
 *
 * PUBLIC:
 *   GET /api/posts           — daftar post yang published
 *   GET /api/posts/:slug     — detail post by slug (published only)
 *
 * PRIVATE (admin):
 *   GET  /api/admin/posts         — semua post (termasuk draft)
 *   GET  /api/admin/posts/:id     — detail by id
 *   POST /api/admin/posts         — buat post baru
 *   PUT  /api/admin/posts/:id     — update post
 *   DEL  /api/admin/posts/:id     — hapus post
 */

import Elysia from "elysia";
import { PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { authGuard } from "@/shared/middleware/auth";
import { ok, fail } from "@/shared/utils/response";
import { createPostSchema, updatePostSchema } from "./posts.schema";

const postsService = new PostsService(new PostsRepository());

// ─────────────────────────────────────────
// Public
// ─────────────────────────────────────────

export const publicPostsRoute = new Elysia({ prefix: "/posts" })
  .get("/", ({ query }) => {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const tag = query?.tag;
    return ok(postsService.getPublishedPosts(page, limit, tag));
  })
  .get("/tags", () => ok(postsService.getAllTags()))
  .get("/:slug", ({ params, set }) => {
    const post = postsService.getPublishedPostBySlug(params.slug);
    if (!post) { set.status = 404; return fail("Post tidak ditemukan"); }
    return ok(post);
  });

// ─────────────────────────────────────────
// Admin (private)
// ─────────────────────────────────────────

export const adminPostsRoute = new Elysia({ prefix: "/admin/posts" })
  .use(authGuard)

  .get("/", () => ok(postsService.getAllPosts()))

  .get("/:id", ({ params, set }) => {
    const post = postsService.getPostById(params.id);
    if (!post) { set.status = 404; return fail("Post tidak ditemukan"); }
    return ok(post);
  })

  .post("/", ({ body, set }) => {
    try {
      const post = postsService.createPost(body);
      set.status = 201;
      return ok(post, "Post dibuat");
    } catch (e) {
      set.status = 409;
      return fail((e as Error).message);
    }
  }, { body: createPostSchema })

  .put("/:id", ({ params, body, set }) => {
    try {
      const post = postsService.updatePost(params.id, body);
      if (!post) { set.status = 404; return fail("Post tidak ditemukan"); }
      return ok(post, "Post diperbarui");
    } catch (e) {
      set.status = 409;
      return fail((e as Error).message);
    }
  }, { body: updatePostSchema })

  .delete("/:id", ({ params, set }) => {
    const deleted = postsService.deletePost(params.id);
    if (!deleted) { set.status = 404; return fail("Post tidak ditemukan"); }
    return ok(null, "Post dihapus");
  });
