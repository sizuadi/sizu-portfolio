# Sizu Portfolio Backend

Backend API untuk portfolio Sizu Dev. Dibangun dengan **ElysiaJS + Bun**.

## Tech Stack

| | |
|---|---|
| Runtime | [Bun](https://bun.sh) |
| Framework | [ElysiaJS](https://elysiajs.com) |
| Database | SQLite (via `bun:sqlite`) |
| Auth | JWT (access) + opaque refresh token |
| Hashing | Argon2id (password) + SHA-256 (refresh token) |
| Docs | Swagger (dev only) |

---

## Arsitektur — SOLID Principle

```
backend/
└── src/
    ├── index.ts                    ← Entry point, assemble semua module
    │
    ├── shared/                     ← Kode yang dipakai banyak module
    │   ├── config/
    │   │   └── env.ts              ← Single Source of Truth untuk env vars
    │   ├── database/
    │   │   ├── client.ts           ← Singleton koneksi DB
    │   │   ├── schema.sql          ← DDL schema
    │   │   ├── migrate.ts          ← Script migrasi
    │   │   └── seed.ts             ← Script seed data awal
    │   ├── middleware/
    │   │   ├── auth.ts             ← JWT guard (dipakai di route manapun)
    │   │   ├── rateLimiter.ts      ← Rate limiting (cegah brute-force)
    │   │   └── securityHeaders.ts  ← Security HTTP headers
    │   └── utils/
    │       ├── id.ts               ← generateId, generateSlug
    │       ├── response.ts         ← ok() / fail() helper
    │       └── token.ts            ← generateRefreshToken, hashToken
    │
    └── modules/                    ← Domain modules (SOLID)
        ├── auth/
        │   ├── auth.repository.ts  ← Data access layer
        │   ├── auth.service.ts     ← Business logic
        │   ├── auth.schema.ts      ← Input validation
        │   └── auth.route.ts       ← HTTP route handler
        ├── portfolio/
        │   ├── portfolio.repository.ts
        │   ├── portfolio.service.ts
        │   ├── portfolio.schema.ts
        │   └── portfolio.route.ts
        └── posts/
            ├── posts.repository.ts
            ├── posts.service.ts
            ├── posts.schema.ts
            └── posts.route.ts
```

### Kenapa struktur ini?

Setiap file punya **satu tanggung jawab** (S dari SOLID):

| File | Tanggung Jawab |
|------|---------------|
| `*.repository.ts` | Query database — tidak ada business logic |
| `*.service.ts` | Business logic — tidak tahu HTTP/response format |
| `*.schema.ts` | Validasi input — tidak ada DB atau business logic |
| `*.route.ts` | HTTP handler — memanggil service, return response |

Ini memudahkan:
- **Testing**: bisa test service tanpa HTTP
- **Perubahan DB**: hanya ubah repository
- **Perubahan business rule**: hanya ubah service
- **Junior onboarding**: tiap file kecil, focused, mudah dipahami

---

## Setup

### 1. Install dependensi

```bash
cd backend
bun install
```

### 2. Konfigurasi environment

```bash
cp .env.example .env
```

Edit `.env` — **wajib ganti**:
```env
JWT_SECRET=random_string_minimal_64_karakter
ADMIN_EMAIL=email_kamu@domain.com
ADMIN_PASSWORD=password_kuat_minimal_8_karakter
```

Generate JWT secret yang kuat:
```bash
openssl rand -base64 64
```

### 3. Inisialisasi database

```bash
bun run seed
```

Script ini akan:
- Membuat file database di `./data/portfolio.db`
- Membuat semua tabel
- Mengisi data awal dari portfolio yang ada
- Membuat admin user

### 4. Jalankan server

```bash
bun run dev    # development (watch mode)
bun run start  # production
```

Server berjalan di `http://localhost:3001`

---

## API Endpoints

### Auth

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/auth/login` | ❌ | Login, set HttpOnly cookies |
| POST | `/api/auth/refresh` | ❌ | Rotate refresh token |
| POST | `/api/auth/logout` | ✅ | Revoke tokens, clear cookies |
| GET | `/api/auth/me` | ✅ | Info user aktif |
| PUT | `/api/auth/password` | ✅ | Ganti password |

### Portfolio (Public — GET)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/portfolio` | Semua data sekaligus |
| GET | `/api/portfolio/meta` | Nama, title, tagline, email |
| GET | `/api/portfolio/about` | Paragraf about |
| GET | `/api/portfolio/skills` | Daftar skill |
| GET | `/api/portfolio/experience` | Semua experience |
| GET | `/api/portfolio/experience/:id` | Detail experience |
| GET | `/api/portfolio/education` | Semua education |
| GET | `/api/portfolio/education/:id` | Detail education |
| GET | `/api/portfolio/projects` | Semua project |
| GET | `/api/portfolio/projects/:id` | Detail project |
| GET | `/api/portfolio/socials` | Social links |

### Portfolio (Private — butuh JWT cookie)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| PUT | `/api/portfolio/meta` | Update meta |
| PUT | `/api/portfolio/about` | Update paragraf about |
| PUT | `/api/portfolio/skills` | Update skills |
| POST/PUT/DELETE | `/api/portfolio/experience` | CRUD experience |
| POST/PUT/DELETE | `/api/portfolio/education` | CRUD education |
| POST/PUT/DELETE | `/api/portfolio/projects` | CRUD project |
| POST/PUT/DELETE | `/api/portfolio/socials` | CRUD social |

### Posts

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/posts` | ❌ | Semua post (published) |
| GET | `/api/posts/:slug` | ❌ | Detail post |
| GET | `/api/admin/posts` | ✅ | Semua post (termasuk draft) |
| POST | `/api/admin/posts` | ✅ | Buat post |
| PUT | `/api/admin/posts/:id` | ✅ | Update post |
| DELETE | `/api/admin/posts/:id` | ✅ | Hapus post |

---

## Keamanan

### Token Strategy
```
Login →
  ├── Access Token (JWT, 15 menit)
  │   └── Set sebagai HttpOnly cookie (path: /)
  │       Browser otomatis kirim ke setiap request
  │       JavaScript TIDAK BISA baca → XSS proof
  │
  └── Refresh Token (opaque random, 7 hari)
      ├── SHA-256 hash disimpan di database
      ├── Set sebagai HttpOnly cookie (path: /api/auth/refresh)
      │   Browser HANYA kirim ke endpoint refresh saja
      └── Raw token dikirim ke browser, tidak pernah disimpan plain text
```

### Fitur keamanan lain
- **Argon2id** untuk hash password (winner PHC 2015, resistant terhadap GPU attacks)
- **Rate limiting** di endpoint auth: 5 request per menit per IP
- **Refresh token rotation**: setiap refresh, token lama langsung direvoke
- **Security headers**: CSP, X-Frame-Options, HSTS, dll
- **Timing-safe comparison**: login tetap proses verifikasi meskipun user tidak ada (mencegah user enumeration)
- **Generic error message**: tidak ada pesan berbeda antara "email salah" dan "password salah"
- **CORS** terbatas hanya ke origin yang terdaftar

---

## Swagger Docs

Saat development, buka: `http://localhost:3001/docs`

Di production, Swagger dinonaktifkan otomatis.

---

## Health Check

```
GET /health
→ { "status": "ok", "timestamp": "...", "env": "development" }
```
