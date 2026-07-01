/**
 * Migration runner
 * Jalankan: bun run migrate
 */

import { db } from "./client";
import { readFileSync } from "fs";
import { join } from "path";

const schemaPath = join(import.meta.dir, "schema.sql");
const schema = readFileSync(schemaPath, "utf-8");

// Eksekusi seluruh schema (CREATE TABLE IF NOT EXISTS = idempoten)
db.exec(schema);

console.log("✅ Migration selesai — semua tabel sudah siap.");
