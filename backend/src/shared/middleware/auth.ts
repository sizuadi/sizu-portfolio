/**
 * Auth Guard Middleware
 *
 * Memverifikasi JWT dari HttpOnly cookie.
 * Inject `user` ke dalam context Elysia untuk digunakan di route handler.
 */

import Elysia, { t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { env } from "@/shared/config/env";
import { fail } from "@/shared/utils/response";

export interface JwtPayload {
  sub: string;   // user id
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Plugin JWT — digunakan sebagai dependency oleh authGuard
 */
export const jwtPlugin = new Elysia({ name: "jwt" }).use(
  jwt({
    name: "jwt",
    secret: env.JWT_SECRET,
    schema: t.Object({
      sub: t.String(),
      email: t.String(),
      role: t.String(),
    }),
  })
);

/**
 * Auth Guard — lindungi route dengan JWT dari cookie
 *
 * Cara pakai:
 *   app.use(authGuard).get("/protected", ({ user }) => user)
 */
export const authGuard = new Elysia({ name: "auth-guard" })
  .use(jwtPlugin)
  .derive({ as: "scoped" }, async ({ jwt, cookie, set }) => {
    const token = cookie.access_token?.value;

    if (!token) {
      set.status = 401;
      throw new Error("Unauthorized — token tidak ditemukan");
    }

    const payload = await jwt.verify(token);
    if (!payload) {
      set.status = 401;
      throw new Error("Unauthorized — token tidak valid atau sudah expired");
    }

    return { user: payload as JwtPayload };
  });
