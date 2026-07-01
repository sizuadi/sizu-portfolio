import { t } from "elysia";

export const createPostSchema = t.Object({
  title: t.String({ minLength: 1 }),
  slug: t.Optional(t.String({ minLength: 1 })),
  excerpt: t.String(),
  content: t.String(),
  date: t.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" }),
  readTime: t.String({ minLength: 1 }),
  tags: t.Array(t.String()),
  published: t.Optional(t.Boolean()),
});

export const updatePostSchema = t.Partial(createPostSchema);
