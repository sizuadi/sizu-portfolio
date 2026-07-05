# ============================================================
# Sizu Portfolio Backend — Dockerfile (Bun + ElysiaJS)
# ============================================================

# ── Stage 1: Install dependencies ────────────────────────────
FROM oven/bun:1.2-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json bun.lock ./
RUN bun install --production

# Copy source
COPY . .

# ── Stage 2: Production image ────────────────────────────────
FROM oven/bun:1.2-alpine AS production

# Install curl untuk healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copy dari builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./

# Buat direktori data untuk SQLite
RUN mkdir -p /app/data

# Security: non-root user
RUN addgroup -g 1001 -S bunuser \
    && adduser -S -u 1001 -G bunuser bunuser \
    && chown -R bunuser:bunuser /app

USER bunuser

EXPOSE 3006

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3006/health || exit 1

CMD ["bun", "run", "src/index.ts"]
