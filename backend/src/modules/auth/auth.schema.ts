/**
 * Auth Validation Schemas (Elysia t / TypeBox)
 *
 * Validasi input di layer route, bukan di service.
 * Service hanya menerima data yang sudah valid.
 */

import { t } from "elysia";

export const loginBodySchema = t.Object({
  email: t.String({ format: "email", error: "Email tidak valid" }),
  password: t.String({ minLength: 8, error: "Password minimal 8 karakter" }),
});

export const changePasswordBodySchema = t.Object({
  currentPassword: t.String({ minLength: 8 }),
  newPassword: t.String({ minLength: 8, error: "Password baru minimal 8 karakter" }),
});
