# ── Sizu Portfolio Admin — Dockerfile (Bun + Vite → Nginx) ──
# TSC dimatikan karena hang pada build di Jenkins (Bun runtime issue)

FROM oven/bun:1.2-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .
# type checking dilewati — tsc hang di Bun 1.2
RUN bun vite build

# ── Serve ─────────────────────────────────────────────────────
FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    server_tokens off;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    location ~* \\.(?:ico|css|js|gif|jpe?g|png|woff2?|svg)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
