/**
 * Auth Routes
 *
 * POST /api/auth/login         — Login, set HttpOnly cookies
 * POST /api/auth/refresh       — Rotate refresh token
 * POST /api/auth/logout        — Revoke tokens, clear cookies
 * GET  /api/auth/me            — Info user yang sedang login (perlu auth)
 * PUT  /api/auth/password      — Ganti password (perlu auth)
 *
 * KEAMANAN HttpOnly Cookie:
 * - access_token: short-lived (15 menit), httpOnly, sameSite=strict
 * - refresh_token: long-lived (7 hari), httpOnly, sameSite=strict, path=/api/auth/refresh
 *   (path terbatas = browser hanya kirim cookie ini ke /api/auth/refresh, bukan ke semua endpoint)
 */

import Elysia from "elysia";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { jwtPlugin, authGuard } from "@/shared/middleware/auth";
import { loginRateLimit } from "@/shared/middleware/rateLimiter";
import { loginBodySchema, changePasswordBodySchema } from "./auth.schema";
import { ok, fail } from "@/shared/utils/response";
import { env } from "@/shared/config/env";

const authService = new AuthService(new AuthRepository());

const COOKIE_BASE = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: "strict" as const,
  path: "/",
} as const;

export const authRoute = new Elysia({ prefix: "/auth" })
  .use(jwtPlugin)

  // ── POST /auth/login ──────────────────────
  .post(
    "/login",
    async ({ jwt, body, cookie, set }) => {
      try {
        const result = await authService.login(body.email, body.password, (p) =>
          jwt.sign(p as Parameters<typeof jwt.sign>[0])
        );

        // Set HttpOnly cookies
        cookie.access_token.set({
          value: result.tokens.accessToken,
          ...COOKIE_BASE,
          maxAge: 15 * 60, // 15 menit dalam detik
        });

        // Refresh token hanya dikirim ke endpoint refresh
        cookie.refresh_token.set({
          value: result.tokens.refreshToken,
          ...COOKIE_BASE,
          path: "/api/auth/refresh",
          maxAge: 7 * 24 * 60 * 60, // 7 hari
        });

        return ok(result.user, "Login berhasil");
      } catch (e) {
        set.status = 401;
        return fail((e as Error).message);
      }
    },
    // Rate limiter HANYA di sini — /me, /refresh, /logout tidak terkena
    { body: loginBodySchema, beforeHandle: loginRateLimit }
  )

  // ── POST /auth/refresh ────────────────────
  .post("/refresh", async ({ jwt, cookie, set }) => {
    const rawRefreshToken = cookie.refresh_token?.value;

    if (!rawRefreshToken) {
      set.status = 401;
      return fail("Refresh token tidak ditemukan");
    }

    try {
      const tokens = await authService.refresh(rawRefreshToken, (p) =>
        jwt.sign(p as Parameters<typeof jwt.sign>[0])
      );

      // Set cookie baru (rotation)
      cookie.access_token.set({
        value: tokens.accessToken,
        ...COOKIE_BASE,
        maxAge: 15 * 60,
      });

      cookie.refresh_token.set({
        value: tokens.refreshToken,
        ...COOKIE_BASE,
        path: "/api/auth/refresh",
        maxAge: 7 * 24 * 60 * 60,
      });

      return ok(null, "Token diperbarui");
    } catch (e) {
      // Hapus cookies jika refresh gagal
      cookie.access_token.remove();
      cookie.refresh_token.remove();
      set.status = 401;
      return fail((e as Error).message);
    }
  })

  // ── POST /auth/logout ─────────────────────
  .use(authGuard)
  .post("/logout", async ({ user, cookie }) => {
    await authService.logout(user.sub);

    cookie.access_token.remove();
    cookie.refresh_token.remove();

    return ok(null, "Logout berhasil");
  })

  // ── GET /auth/me ──────────────────────────
  .get("/me", ({ user }) => ok(user))

  // ── PUT /auth/password ────────────────────
  .put(
    "/password",
    async ({ user, body, set }) => {
      try {
        await authService.changePassword(
          user.sub,
          body.currentPassword,
          body.newPassword
        );
        return ok(null, "Password berhasil diubah. Silakan login ulang.");
      } catch (e) {
        set.status = 400;
        return fail((e as Error).message);
      }
    },
    { body: changePasswordBodySchema }
  );
