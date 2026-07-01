/**
 * Environment Configuration — Single Responsibility Principle
 *
 * Satu tempat untuk semua environment variable.
 * Validasi dilakukan saat startup — fail fast jika ada yang kurang.
 */

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Environment variable "${key}" wajib diisi. Cek file .env`);
  }
  return value;
}

function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

export const env = {
  PORT: parseInt(getOptionalEnv("PORT", "3001"), 10),
  NODE_ENV: getOptionalEnv("NODE_ENV", "development"),

  JWT_SECRET: getRequiredEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getOptionalEnv("JWT_EXPIRES_IN", "15m"),
  REFRESH_TOKEN_EXPIRES_IN: getOptionalEnv("REFRESH_TOKEN_EXPIRES_IN", "7d"),

  DATABASE_PATH: getOptionalEnv("DATABASE_PATH", "./data/portfolio.db"),

  FRONTEND_URL: getOptionalEnv("FRONTEND_URL", "http://localhost:5173"),
  ADMIN_URL: getOptionalEnv("ADMIN_URL", "http://localhost:5174"),

  ADMIN_EMAIL: getRequiredEnv("ADMIN_EMAIL"),
  ADMIN_PASSWORD: getRequiredEnv("ADMIN_PASSWORD"),

  RATE_LIMIT_AUTH: parseInt(getOptionalEnv("RATE_LIMIT_AUTH", "5"), 10),
  RATE_LIMIT_WINDOW: parseInt(getOptionalEnv("RATE_LIMIT_WINDOW", "60000"), 10),

  get isProd() {
    return this.NODE_ENV === "production";
  },
  get isDev() {
    return this.NODE_ENV === "development";
  },
} as const;
