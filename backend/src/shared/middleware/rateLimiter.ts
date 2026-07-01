/**
 * Rate Limiter — in-memory, per-IP
 *
 * Dipakai sebagai `beforeHandle` inline di endpoint tertentu (bukan plugin global).
 * Ini memastikan limit hanya berlaku untuk route yang dituju, bukan semua route.
 *
 * Untuk production multi-instance → ganti store dengan Redis.
 */

import { env } from "@/shared/config/env";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// store terpisah per "nama bucket" agar limit login tidak interferensi dengan bucket lain
const stores = new Map<string, Map<string, RateLimitEntry>>();

// Bersihkan entry expired setiap 5 menit
setInterval(() => {
  const now = Date.now();
  for (const store of stores.values()) {
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Buat handler beforeHandle yang bisa langsung dipakai di `.post("/login", handler, { beforeHandle })`
 *
 * @param bucket  - nama unik untuk memisahkan counter (misal "login", "reset-password")
 * @param max     - maksimal request per window
 * @param windowMs - durasi window dalam milidetik
 */
export function rateLimitHandler(
  bucket: string,
  max: number = env.RATE_LIMIT_AUTH,
  windowMs: number = env.RATE_LIMIT_WINDOW
) {
  if (!stores.has(bucket)) stores.set(bucket, new Map());
  const store = stores.get(bucket)!;

  return ({ request, set }: { request: Request; set: { status: number; headers: Record<string, string> } }) => {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const key = `${bucket}:${ip}`;
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
    } else {
      entry.count++;
      if (entry.count > max) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        set.status = 429;
        set.headers["Retry-After"] = String(retryAfter);
        return new Response(
          JSON.stringify({ success: false, error: "Terlalu banyak percobaan. Coba lagi dalam beberapa saat." }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  };
}

/** Preset untuk endpoint login */
export const loginRateLimit = rateLimitHandler("login");
