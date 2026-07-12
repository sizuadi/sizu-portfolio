const BASE_URL = import.meta.env.VITE_API_URL ?? "https://api.sizu.dev/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface PostDetail extends PostSummary {
  content: string;
}

async function fetchJSON<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  return res.json();
}

export async function getPosts(page = 1, limit = 10, tag?: string) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (tag) params.set("tag", tag);
  return fetchJSON<{ posts: PostSummary[]; total: number }>(`${BASE_URL}/posts?${params}`);
}

export async function getAllTags() {
  return fetchJSON<string[]>(`${BASE_URL}/posts/tags`);
}

export async function getPostBySlug(slug: string) {
  return fetchJSON<PostDetail>(`${BASE_URL}/posts/${slug}`);
}
