# Manajemen Perpustakaan

Tugas Final Praktikum Pemrograman Web 2026 (Individual Project 5).
Stack: Next.js (App Router, JSX), Tailwind CSS, PostgreSQL dengan Raw SQL (`pg`).

## Cara Menjalankan

1. **Siapkan database**
   - Buka pgAdmin, buat database kosong bernama `perpustakaan`.
   - Buka Query Tool pada database tersebut, jalankan isi `database/schema.sql`, lalu `database/seed.sql`.
   - Atau lewat terminal:
     ```bash
     psql -U postgres -d perpustakaan -f database/schema.sql
     psql -U postgres -d perpustakaan -f database/seed.sql
     ```
2. **Atur environment**
   ```bash
   cp .env.example .env.local
   ```
   Isi `DATABASE_URL` dengan password PostgreSQL kamu, dan `SESSION_SECRET` dengan string acak minimal 32 karakter
   (contoh pembuatan: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
3. **Install dan jalankan**
   ```bash
   npm install
   npm run dev
   ```
4. Buka `http://localhost:3000`. Uji koneksi database di `http://localhost:3000/api/health`.

## Akun Demo

| Role | Email | Password |
|---|---|---|
| Admin | admin@perpus.ac.id | admin123 |
| Pegawai | pegawai@perpus.ac.id | pegawai123 |
| Mahasiswa | andi@student.unhas.ac.id | mahasiswa123 |
| Mahasiswa | siti@student.unhas.ac.id | mahasiswa123 |
| Mahasiswa (denda tertunggak, diblokir) | rudi@student.unhas.ac.id | mahasiswa123 |

Password disimpan sebagai hash bcrypt di database.

## Struktur Penting

```text
database/        schema.sql dan seed.sql (di luar folder app, sesuai aturan tugas)
src/app/         halaman dan route handler (App Router)
src/lib/db.js    koneksi PostgreSQL (Pool) dan helper transaksi
PROGRESS.md      catatan progres harian
```
