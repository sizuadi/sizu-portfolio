/**
 * API Client
 *
 * Wrapper fetch yang:
 * 1. Selalu include credentials (untuk HttpOnly cookie)
 * 2. Handle 401 → auto refresh token
 * 3. Handle 401 setelah refresh → redirect ke /login
 *
 * Token TIDAK disimpan di memory/localStorage.
 * Browser mengelola cookie secara otomatis — kita hanya perlu
 * `credentials: "include"` di setiap request.
 */

// Di development pakai proxy Vite (/api → localhost:3001)
// Di production set VITE_API_URL ke URL backend yang sebenarnya
const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retried = false
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include", // wajib untuk cookie
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  // Token expired → coba refresh
  if (res.status === 401 && !retried) {
    if (!isRefreshing) {
      isRefreshing = true;
      const ok = await refreshAccessToken();
      isRefreshing = false;

      if (!ok) {
        // Refresh gagal → redirect ke login
        refreshQueue = [];
        window.location.href = "/login";
        return { success: false, error: "Session berakhir" };
      }

      // Jalankan request yang antri
      refreshQueue.forEach((fn) => fn());
      refreshQueue = [];
    } else {
      // Tunggu refresh selesai lalu retry
      await new Promise<void>((resolve) => refreshQueue.push(resolve));
    }

    return request<T>(endpoint, options, true);
  }

  const json = await res.json().catch(() => ({ success: false, error: "Invalid JSON response" }));
  return json as ApiResponse<T>;
}

// ─────────────────────────────────────────
// HTTP Methods
// ─────────────────────────────────────────

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};

// ─────────────────────────────────────────
// Auth API
// ─────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ id: string; email: string; role: string }>("/auth/login", { email, password }),

  logout: () => api.post("/auth/logout"),

  me: () => api.get<{ sub: string; email: string; role: string }>("/auth/me"),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put("/auth/password", { currentPassword, newPassword }),
};

// ─────────────────────────────────────────
// Portfolio API
// ─────────────────────────────────────────

export const portfolioApi = {
  getMeta: () => api.get("/portfolio/meta"),
  updateMeta: (data: unknown) => api.put("/portfolio/meta", data),

  getAbout: () => api.get<string[]>("/portfolio/about"),
  updateAbout: (paragraphs: string[]) => api.put("/portfolio/about", { paragraphs }),

  getSkills: () => api.get<string[]>("/portfolio/skills"),
  updateSkills: (skills: string[]) => api.put("/portfolio/skills", { skills }),

  getExperiences: () => api.get("/portfolio/experience"),
  createExperience: (data: unknown) => api.post("/portfolio/experience", data),
  updateExperience: (id: string, data: unknown) => api.put(`/portfolio/experience/${id}`, data),
  deleteExperience: (id: string) => api.delete(`/portfolio/experience/${id}`),

  getEducations: () => api.get("/portfolio/education"),
  createEducation: (data: unknown) => api.post("/portfolio/education", data),
  updateEducation: (id: string, data: unknown) => api.put(`/portfolio/education/${id}`, data),
  deleteEducation: (id: string) => api.delete(`/portfolio/education/${id}`),

  getProjects: () => api.get("/portfolio/projects"),
  createProject: (data: unknown) => api.post("/portfolio/projects", data),
  updateProject: (id: string, data: unknown) => api.put(`/portfolio/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/portfolio/projects/${id}`),

  getSocials: () => api.get("/portfolio/socials"),
  createSocial: (data: unknown) => api.post("/portfolio/socials", data),
  updateSocial: (id: number, data: unknown) => api.put(`/portfolio/socials/${id}`, data),
  deleteSocial: (id: number) => api.delete(`/portfolio/socials/${id}`),
};

// ─────────────────────────────────────────
// Posts API
// ─────────────────────────────────────────

export const postsApi = {
  getAll: () => api.get("/admin/posts"),
  getById: (id: string) => api.get(`/admin/posts/${id}`),
  create: (data: unknown) => api.post("/admin/posts", data),
  update: (id: string, data: unknown) => api.put(`/admin/posts/${id}`, data),
  delete: (id: string) => api.delete(`/admin/posts/${id}`),
};
