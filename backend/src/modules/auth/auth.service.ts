/**
 * Auth Service — Single Responsibility Principle
 *
 * Service bertugas untuk business logic autentikasi:
 * - Login dengan verifikasi argon2
 * - Generate JWT access token (15 menit)
 * - Generate opaque refresh token (7 hari, disimpan hash-nya di DB)
 * - Refresh token rotation (setiap refresh, token lama direvoke)
 * - Logout (revoke semua token user)
 *
 * KEAMANAN:
 * - Access token: JWT short-lived (15 menit), dikirim via HttpOnly cookie
 * - Refresh token: opaque random, hash disimpan di DB, dikirim via HttpOnly cookie
 * - Tidak ada token yang disimpan di localStorage
 */

import { AuthRepository } from "./auth.repository";
import { generateRefreshToken, hashToken } from "@/shared/utils/token";
import { env } from "@/shared/config/env";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date; // kapan refresh token expired
}

export interface LoginResult {
  tokens: TokenPair;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  constructor(private readonly repo: AuthRepository) {}

  /**
   * Login: verifikasi email + password, return token pair
   *
   * @throws Error jika kredensial salah (pesan generik untuk mencegah user enumeration)
   */
  async login(
    email: string,
    password: string,
    jwtSign: (payload: object) => Promise<string>
  ): Promise<LoginResult> {
    const user = this.repo.findUserByEmail(email);

    // Tetap verifikasi password meskipun user tidak ada (timing attack mitigation)
    // Gunakan dummy hash jika user tidak ditemukan
    const dummyHash =
      "$argon2id$v=19$m=65536,t=3,p=4$dummydummydummydummydummydumm$dummydummydummydummydummydummydummydummydumm";
    const passwordToVerify = user ? user.password : dummyHash;

    let isValid = false;
    try {
      // Bun.password.verify auto-detects hash algorithm (argon2id/bcrypt)
      isValid = await Bun.password.verify(password, passwordToVerify);
    } catch {
      isValid = false;
    }

    if (!user || !isValid) {
      throw new Error("Email atau password salah");
    }

    const tokens = await this.generateTokenPair(user.id, user.email, user.role, jwtSign);

    return {
      tokens,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  /**
   * Refresh: rotate refresh token
   * Token lama langsung direvoke setelah berhasil dibuat yang baru.
   */
  async refresh(
    rawRefreshToken: string,
    jwtSign: (payload: object) => Promise<string>
  ): Promise<TokenPair> {
    const tokenHash = await hashToken(rawRefreshToken);
    const storedToken = this.repo.findRefreshToken(tokenHash);

    if (!storedToken) {
      throw new Error("Refresh token tidak valid atau sudah expired");
    }

    // Cek apakah sudah expired
    if (new Date(storedToken.expires_at) < new Date()) {
      this.repo.revokeRefreshToken(tokenHash);
      throw new Error("Refresh token sudah expired, silakan login ulang");
    }

    const user = this.repo.findUserById(storedToken.user_id);
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    // Revoke token lama (rotation)
    this.repo.revokeRefreshToken(tokenHash);

    // Generate token pair baru
    return this.generateTokenPair(user.id, user.email, user.role, jwtSign);
  }

  /**
   * Logout: revoke semua refresh token user
   */
  async logout(userId: string): Promise<void> {
    this.repo.revokeAllUserRefreshTokens(userId);
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = this.repo.findUserById(userId);
    if (!user) throw new Error("User tidak ditemukan");

    const userWithPassword = this.repo.findUserByEmail(user.email);
    if (!userWithPassword) throw new Error("User tidak ditemukan");

    const isValid = await argon2Verify(userWithPassword.password, currentPassword);
    if (!isValid) throw new Error("Password saat ini salah");

    const newHash = await Bun.password.hash(newPassword, { algorithm: "argon2id" });

    this.repo.updateUserPassword(userId, newHash);
    // Revoke semua session lain setelah ganti password
    this.repo.revokeAllUserRefreshTokens(userId);
  }

  // ─────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────

  private async generateTokenPair(
    userId: string,
    email: string,
    role: string,
    jwtSign: (payload: object) => Promise<string>
  ): Promise<TokenPair> {
    // JWT access token — short lived
    const accessToken = await jwtSign({
      sub: userId,
      email,
      role,
    });

    // Opaque refresh token
    const rawRefreshToken = generateRefreshToken();
    const tokenHash = await hashToken(rawRefreshToken);

    // Expiry: parse env (format: "7d", "1h", etc.)
    const expiresAt = parseExpiry(env.REFRESH_TOKEN_EXPIRES_IN);
    this.repo.saveRefreshToken(userId, tokenHash, expiresAt);

    return {
      accessToken,
      refreshToken: rawRefreshToken, // kirim yang raw ke cookie
      expiresAt,
    };
  }
}

/** Parse "7d", "1h", "15m" ke Date */
function parseExpiry(expiry: string): Date {
  const now = Date.now();
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return new Date(now + 7 * 24 * 60 * 60 * 1000);

  const value = parseInt(match[1]!, 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return new Date(now + value * (multipliers[unit!] ?? 0));
}
