/**
 * Sizu Portfolio Backend
 * Built with ElysiaJS + Bun
 *
 * Entry point — assembles semua plugins dan routes.
 */

import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

import { env } from "@/shared/config/env";
import { securityHeaders } from "@/shared/middleware/securityHeaders";

import { authRoute } from "@/modules/auth/auth.route";
import { portfolioRoute } from "@/modules/portfolio/portfolio.route";
import { publicPostsRoute, adminPostsRoute } from "@/modules/posts/posts.route";

const app = new Elysia()
  // ── Security Headers ───────────────────────
  .use(securityHeaders)

  // ── CORS ──────────────────────────────────
  // Hanya izinkan origin dari frontend dan admin panel
  .use(
    cors({
      origin: [env.FRONTEND_URL, env.ADMIN_URL, env.BLOG_URL],
      credentials: true, // wajib untuk cookie cross-origin
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )

  // ── Swagger Docs (hanya di development) ───
  .use(
    swagger({
      documentation: {
        info: {
          title: "Sizu Portfolio API",
          version: "1.0.0",
          description: "API untuk mengelola konten portfolio Sizu Dev",
        },
        tags: [
          { name: "Auth", description: "Autentikasi" },
          { name: "Portfolio", description: "Data portfolio (public)" },
          { name: "Posts", description: "Blog posts (public)" },
          { name: "Admin", description: "Admin endpoints (private)" },
        ],
      },
      path: env.isDev ? "/docs" : undefined,
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  )

  // ── Routes ────────────────────────────────
  .group("/api", (api) =>
    api
      .use(authRoute)
      .use(portfolioRoute)
      .use(publicPostsRoute)
      .use(adminPostsRoute)
  )

  // ── Health Check ──────────────────────────
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  }))

  // ── Global Error Handler ──────────────────
  .onError(({ code, error, set }) => {
    console.error(`[${code}]`, error.message);

    // Jangan expose internal error ke client di production
    const message = env.isProd
      ? "Terjadi kesalahan pada server"
      : error.message;

    if (code === "VALIDATION") {
      set.status = 422;
      return { success: false, error: "Data tidak valid", details: error.message };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      return { success: false, error: "Endpoint tidak ditemukan" };
    }

    set.status = 500;
    return { success: false, error: message };
  })

  .listen(env.PORT);

console.log(`
🚀 Sizu Portfolio Backend berjalan!
   URL:    http://localhost:${env.PORT}
   Docs:   http://localhost:${env.PORT}/docs  ${env.isDev ? "(aktif)" : "(nonaktif di production)"}
   Health: http://localhost:${env.PORT}/health
   Env:    ${env.NODE_ENV}
`);

export type App = typeof app;
