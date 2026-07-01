/**
 * Portfolio API Client
 *
 * Fetch data dari backend ElysiaJS.
 * Fallback ke static data jika backend tidak tersedia (development).
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

async function apiFetch<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? (json.data as T) : null;
  } catch {
    // Backend tidak tersedia — return null, komponen akan pakai fallback
    return null;
  }
}

export const portfolioApiClient = {
  getAll: () => apiFetch<unknown>("/portfolio"),
  getPosts: () => apiFetch<unknown[]>("/posts"),
  getPost: (slug: string) => apiFetch<unknown>(`/posts/${slug}`),
};
