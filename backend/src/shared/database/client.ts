/**
 * Database Client — Single Responsibility Principle
 *
 * File ini hanya bertanggung jawab untuk:
 * 1. Membuka koneksi database SQLite
 * 2. Memastikan direktori data ada
 * 3. Mengekspos satu instance db (singleton)
 */

import { Database } from "bun:sqlite";
import { mkdirSync } from "fs";
import { dirname } from "path";
import { env } from "@/shared/config/env";

const dbPath = env.DATABASE_PATH;

// Pastikan direktori database sudah ada
mkdirSync(dirname(dbPath), { recursive: true });

export const db = new Database(dbPath, {
  // WAL mode = lebih cepat untuk concurrent reads
  strict: true,
});

// Aktifkan WAL dan foreign keys setiap koneksi
db.run("PRAGMA journal_mode = WAL");
db.run("PRAGMA foreign_keys = ON");
