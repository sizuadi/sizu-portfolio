/**
 * Token Utilities
 *
 * - generateRefreshToken: buat opaque token acak
 * - hashToken: hash token sebelum disimpan ke DB (never store raw tokens)
 */

export function generateRefreshToken(): string {
  // 256-bit opaque token
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64url");
}

export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(hashBuffer).toString("hex");
}
