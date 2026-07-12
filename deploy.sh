#!/bin/bash
set -e

echo "[deploy] Start: $(date)"
cd /var/www/sizu-portfolio

# Image tag dari environment (dikirim Jenkins), default: latest
TAG=${IMAGE_TAG:-latest}
DOCKER_HUB_USER="sizuwanoadi"

echo "[deploy] Pulling images tag: $TAG"
docker pull ${DOCKER_HUB_USER}/sizu-portfolio-frontend:${TAG}
docker pull ${DOCKER_HUB_USER}/sizu-portfolio-backend:${TAG}
docker pull ${DOCKER_HUB_USER}/sizu-portfolio-admin:${TAG}
docker pull ${DOCKER_HUB_USER}/sizu-portfolio-blog:${TAG}

echo "[deploy] Updating docker-compose dengan tag: $TAG"
export FRONTEND_IMAGE="${DOCKER_HUB_USER}/sizu-portfolio-frontend:${TAG}"
export BACKEND_IMAGE="${DOCKER_HUB_USER}/sizu-portfolio-backend:${TAG}"
export ADMIN_IMAGE="${DOCKER_HUB_USER}/sizu-portfolio-admin:${TAG}"
export BLOG_IMAGE="${DOCKER_HUB_USER}/sizu-portfolio-blog:${TAG}"

echo "[deploy] Stopping containers..."
docker compose down

echo "[deploy] Starting containers..."
docker compose up -d

echo "[deploy] Done: $(date)"
docker compose ps
