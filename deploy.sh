#!/bin/bash
set -e

echo "[deploy] Start: $(date)"
cd /var/www/sizu-portfolio

echo "[deploy] Git pull..."
git pull origin main

echo "[deploy] Docker build + up..."
docker compose build --no-cache
docker compose up -d --force-recreate

echo "[deploy] Done: $(date)"
docker compose ps
