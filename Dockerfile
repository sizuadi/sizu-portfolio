# ============================================================
# Sizu Portfolio Frontend — Dockerfile (Bun + Vite → Nginx)
# ============================================================

FROM oven/bun:1.2-alpine AS builder-frontend

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

# ── Serve ─────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS frontend

RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

COPY --from=builder-frontend /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/index.html || exit 1

CMD ["nginx", "-g", "daemon off;"]
