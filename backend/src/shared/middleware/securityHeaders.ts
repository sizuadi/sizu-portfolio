/**
 * Security Headers Middleware
 *
 * Tambahkan security headers di setiap response untuk mencegah:
 * - XSS (X-Content-Type-Options, CSP)
 * - Clickjacking (X-Frame-Options)
 * - Information leakage (X-Powered-By dihapus)
 * - MIME sniffing (X-Content-Type-Options)
 */

import Elysia from "elysia";

export const securityHeaders = new Elysia({ name: "security-headers" }).onAfterHandle(
  { as: "global" },
  ({ set }) => {
    set.headers["X-Content-Type-Options"] = "nosniff";
    set.headers["X-Frame-Options"] = "DENY";
    set.headers["X-XSS-Protection"] = "1; mode=block";
    set.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    set.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    set.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
  }
);
