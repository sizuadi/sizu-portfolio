# Sizu Portfolio Admin Panel

Aplikasi web admin untuk mengelola konten portfolio. Dibangun dengan React + Vite + Tailwind CSS.

## Fitur

| Halaman | Fungsi |
|---------|--------|
| Dashboard | Ringkasan statistik konten |
| About & Skills | Edit paragraf bio dan daftar skill |
| Experience | CRUD pengalaman kerja |
| Education | CRUD riwayat pendidikan |
| Projects | CRUD project portfolio |
| Blog Posts | CRUD artikel dengan Markdown editor |
| Social Links | Kelola link media sosial |
| Settings | Update meta portfolio + ganti password |

## Keamanan

- Token **tidak pernah** disimpan di `localStorage` atau `sessionStorage`
- Access token disimpan sebagai **HttpOnly cookie** — tidak bisa diakses JavaScript
- Refresh token disimpan sebagai HttpOnly cookie dengan `path=/api/auth/refresh` — hanya dikirim ke endpoint refresh
- Auto-refresh token dilakukan secara transparan di background
- Saat refresh gagal → otomatis redirect ke `/login`

## Setup

```bash
cd admin
npm install   # atau bun install
npm run dev   # jalankan di port 5174
```

Pastikan backend berjalan di port 3001. Vite otomatis proxy `/api/*` ke backend.

## Build Production

```bash
npm run build
```

Output di folder `dist/` — deploy sebagai static hosting atau serve dengan nginx.

Contoh nginx config:
```nginx
server {
  listen 8080;
  root /path/to/admin/dist;
  index index.html;

  # Semua route → index.html (SPA)
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Proxy API ke backend
  location /api/ {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```
