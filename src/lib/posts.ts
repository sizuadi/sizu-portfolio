import type { Post } from "@/types/portfolio";

// Load all .md files from content/posts at build time
const postFiles = import.meta.glob("/content/posts/*.md", {
  query: "?raw",
  eager: true,
});

export interface PostWithContent extends Post {
  slug: string;
  content: string;
}

/**
 * Lightweight frontmatter parser (browser-safe, no gray-matter needed).
 * Expects files starting with `---\n...\n---\n`.
 */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const yamlBlock = match[1] ?? "";
  const content = match[2] ?? "";
  const data: Record<string, unknown> = {};

  for (const line of yamlBlock.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let value: string | string[] = trimmed.slice(colonIdx + 1).trim();

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parse arrays like ["tag1", "tag2"]
    if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1);
      value = inner.split(",").map((s: string) =>
        s.trim().replace(/^["']|["']$/g, "")
      );
    }

    data[key] = value;
  }

  return { data, content };
}

function parsePost(filename: string, raw: string): PostWithContent {
  const { data, content } = parseFrontmatter(raw);
  const slug = filename
    .replace(/^\/content\/posts\//, "")
    .replace(/\.md$/, "");

  return {
    id: slug,
    slug,
    title: (data.title as string) ?? "Untitled",
    excerpt: (data.excerpt as string) ?? "",
    date: (data.date as string) ?? "",
    readTime: (data.readTime as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    content,
  };
}

// Parse and sort all posts (newest first)
export const allPosts: PostWithContent[] = Object.entries(postFiles)
  .map(([path, mod]) => parsePost(path, (mod as { default: string }).default))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Lookup a single post by slug
export function getPostBySlug(slug: string): PostWithContent | undefined {
  return allPosts.find((p) => p.slug === slug);
}
