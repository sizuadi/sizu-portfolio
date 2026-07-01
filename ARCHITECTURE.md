# Arsitektur Sistem — Sizu Portfolio

## Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SIZU PORTFOLIO SYSTEM                         │
│                                                                       │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐  │
│  │  Portfolio FE   │    │   Admin Panel   │    │    Backend      │  │
│  │  (Vite+React)   │    │  (Vite+React)   │    │  (ElysiaJS+Bun) │  │
│  │  Port: 5173     │    │  Port: 5174     │    │  Port: 3001     │  │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘  │
│           │                      │                      │            │
│           │  GET /api/portfolio  │                      │            │
│           ├─────────────────────────────────────────────►            │
│           │  (public, no auth)   │                      │            │
│           │                      │                      │            │
│           │                      │  POST /api/auth/login│            │
│           │                      ├─────────────────────►│            │
│           │                      │  ← HttpOnly cookies  │            │
│           │                      │                      │            │
│           │                      │  CRUD /api/portfolio │            │
│           │                      ├─────────────────────►│            │
│           │                      │  (cookie auth)       │            │
│           │                      │                      │            │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Public (Frontend Portfolio)

```
Browser → GET /api/portfolio
        ← JSON { name, title, skills, experience, ... }

Portfolio FE merender data.
Jika API down → fallback ke static data (src/data/portfolio.ts)
```

### Protected (Admin Panel)

```
1. Login:
   Browser → POST /api/auth/login { email, password }
           ← Set-Cookie: access_token=<JWT>; HttpOnly; Secure; SameSite=Strict
           ← Set-Cookie: refresh_token=<opaque>; HttpOnly; Secure; path=/api/auth/refresh

2. Request terproteksi:
   Browser → PUT /api/portfolio/meta
             Cookie: access_token=<JWT>  ← otomatis dikirim browser
           ← 200 OK / 401 Unauthorized

3. Token expired (15 menit):
   API client → POST /api/auth/refresh
                Cookie: refresh_token=<opaque>  ← otomatis dikirim (hanya ke path ini)
              ← Set-Cookie: access_token=<JWT baru>; ...
              ← Set-Cookie: refresh_token=<opaque baru>; ...  (rotation!)
   API client retry request awal → sukses

4. Refresh token expired (7 hari) / dicabut:
   → Redirect ke /login
```

## Token Storage Comparison

| Metode | XSS | CSRF | Expired? |
|--------|-----|------|---------|
| localStorage | ❌ Rentan | ✅ Aman | Manual |
| sessionStorage | ❌ Rentan | ✅ Aman | Auto (tab close) |
| **HttpOnly Cookie** | ✅ **Aman** | ⚠️ Perlu SameSite | Auto |

**Sistem ini menggunakan HttpOnly cookie + SameSite=Strict** → protection terhadap XSS dan CSRF.

## Database Schema (SQLite)

```
users               ← admin accounts
refresh_tokens      ← opaque refresh token hashes
portfolio_meta      ← singleton (name, title, tagline, email, resume)
about_paragraphs    ← paragraf bio
skills              ← daftar skill
experiences         ← pengalaman kerja
  experience_impacts
  experience_techs
educations          ← riwayat pendidikan
  education_achievements
projects            ← portfolio project
  project_techs
  project_highlights
socials             ← link media sosial
posts               ← blog posts (markdown content)
  post_tags
```

## SOLID Principle Implementation

```
S — Single Responsibility
    repository.ts → hanya akses DB
    service.ts    → hanya business logic
    schema.ts     → hanya validasi input
    route.ts      → hanya handle HTTP

O — Open/Closed
    Middleware (authGuard, rateLimiter) bisa ditambah ke route manapun
    tanpa mengubah implementasi route yang ada

L — Liskov Substitution
    Repository dapat diganti (misal dari SQLite ke PostgreSQL)
    tanpa mengubah service karena service hanya memanggil method yang sama

I — Interface Segregation
    AuthRepository: hanya method yang dibutuhkan auth
    PortfolioRepository: hanya method yang dibutuhkan portfolio
    Tidak ada "god repository" dengan semua method

D — Dependency Inversion
    Service menerima Repository sebagai constructor argument
    Mudah untuk inject mock saat testing:
    const service = new AuthService(new MockAuthRepository())
```

## Cara Jalankan Semua

```bash
# Terminal 1: Backend
cd backend
bun run seed  # pertama kali saja
bun run dev

# Terminal 2: Frontend Portfolio
cd ..  # root project
bun dev  # atau npm run dev

# Terminal 3: Admin Panel
cd admin
bun dev  # atau npm run dev
```

URLs:
- Portfolio: http://localhost:5173
- Admin:     http://localhost:5174
- Backend:   http://localhost:3001
- API Docs:  http://localhost:3001/docs
