/**
 * Auth Repository — Interface Segregation Principle
 *
 * Repository hanya bertugas untuk akses data (DB).
 * Tidak ada business logic di sini.
 */

import { db } from "@/shared/database/client";
import type { JwtPayload } from "@/shared/middleware/auth";

export interface UserRow {
  id: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
}

export interface RefreshTokenRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  revoked: number;
}

export class AuthRepository {
  findUserByEmail(email: string): UserRow | null {
    return db.query<UserRow, [string]>(
      "SELECT id, email, password, role, created_at FROM users WHERE email = ?"
    ).get(email);
  }

  findUserById(id: string): Omit<UserRow, "password"> | null {
    return db.query<Omit<UserRow, "password">, [string]>(
      "SELECT id, email, role, created_at FROM users WHERE id = ?"
    ).get(id);
  }

  saveRefreshToken(userId: string, tokenHash: string, expiresAt: Date): void {
    db.run(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES (?, ?, ?)`,
      [userId, tokenHash, expiresAt.toISOString()]
    );
  }

  findRefreshToken(tokenHash: string): RefreshTokenRow | null {
    return db.query<RefreshTokenRow, [string]>(
      `SELECT id, user_id, token_hash, expires_at, revoked
       FROM refresh_tokens
       WHERE token_hash = ? AND revoked = 0`
    ).get(tokenHash);
  }

  revokeRefreshToken(tokenHash: string): void {
    db.run(
      "UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?",
      [tokenHash]
    );
  }

  revokeAllUserRefreshTokens(userId: string): void {
    db.run(
      "UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?",
      [userId]
    );
  }

  /** Hapus refresh token expired (cleanup rutin) */
  deleteExpiredTokens(): void {
    db.run(
      "DELETE FROM refresh_tokens WHERE expires_at < datetime('now') OR revoked = 1"
    );
  }

  updateUserPassword(userId: string, hashedPassword: string): void {
    db.run(
      "UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?",
      [hashedPassword, userId]
    );
  }
}
