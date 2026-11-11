# Manajemen Perpustakaan

Sistem manajemen perpustakaan kampus berbasis web: pengelolaan koleksi buku, pengumuman, dan transaksi peminjaman dengan hak akses per peran.

Proyek ini adalah Tugas Final Praktikum Pemrograman Web 2026 

## Teknologi

| Bagian | Teknologi |
|---|---|
| Framework | Next.js (App Router, JSX) |
| Styling | Tailwind CSS |
| Database | PostgreSQL dengan Raw SQL (library `pg`) |
| Autentikasi | Password hash `bcryptjs`, sesi cookie httpOnly bertanda tangan HMAC |

## Peran Pengguna

| Peran | Hak akses |
|---|---|
| **Admin** | Mengelola akun pengguna dan kategori buku, memantau statistik dan seluruh transaksi |
| **Pegawai** | Mengelola buku dan pengumuman, menyetujui/menolak peminjaman, memproses pengembalian dan pelunasan denda |
| **Mahasiswa** | Menelusuri katalog, mengajukan peminjaman dan perpanjangan, memantau denda, memberi rating dan ulasan |
| **Guest** | Melihat katalog, detail buku, dan pengumuman tanpa login |

## Status Pengerjaan

Proyek dikerjakan dalam 8 hari. Catatan lengkap ada di [`PROGRESS.md`](PROGRESS.md).

| Hari | Fokus | Status |
|---|---|---|
| 1 | Setup project dan desain database | Selesai |
| 2 | Autentikasi: register, login, sesi, proteksi route per role | Selesai |
| 3 | Admin: User Management dan Category Management | Belum |
| 4 | Book Management dan katalog (filter, sorting) | Belum |
| 5 | Pengumuman, homepage, detail buku, mode Guest | Belum |
| 6 | Alur peminjaman (ajukan, approve/reject, pengembalian) | Belum |
| 7 | Perpanjangan, denda, blokir pinjam, rating dan ulasan | Belum |
| 8 | Dashboard 3 peran, responsivitas, pengujian, README final | Belum |

### Sudah tersedia
- Register Mahasiswa dengan validasi email kampus (`.ac.id`), NIM, dan password
- Login dan logout untuk Admin, Pegawai, dan Mahasiswa
- Sesi cookie httpOnly bertanda tangan (role tidak dapat diubah dari browser)
- Proteksi halaman `/admin`, `/pegawai`, dan `/mahasiswa` sesuai peran
- Skema database 6 tabel, view hitung denda, dan data contoh
- Endpoint uji koneksi database `/api/health`

## Cara Menjalankan

Prasyarat: Node.js 20 atau lebih baru, PostgreSQL, dan pgAdmin (opsional).

1. **Clone dan install**
   ```bash
   git clone <url-repository-ini>
   cd manajemen-perpustakaan
   npm install
   ```

2. **Siapkan database**
   - Buat database kosong bernama `perpustakaan`.
   - Jalankan `database/schema.sql`, lalu `database/seed.sql`, lewat Query Tool pgAdmin atau terminal:
     ```bash
     psql -U postgres -d perpustakaan -f database/schema.sql
     psql -U postgres -d perpustakaan -f database/seed.sql
     ```

3. **Atur environment**
   ```bash
   cp .env.example .env.local
   ```
   Isi `.env.local`:
   - `DATABASE_URL`: contoh `postgresql://postgres:PASSWORD@localhost:5432/perpustakaan`
   - `SESSION_SECRET`: string acak minimal 32 karakter. Contoh pembuatan:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

4. **Jalankan**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000`. Cek koneksi database di `http://localhost:3000/api/health`.

## Akun Demo

| Peran | Email | Password |
|---|---|---|
| Admin | admin@perpus.ac.id | admin123 |
| Pegawai | pegawai@perpus.ac.id | pegawai123 |
| Mahasiswa | andi@student.unhas.ac.id | mahasiswa123 |
| Mahasiswa | siti@student.unhas.ac.id | mahasiswa123 |
| Mahasiswa (denda tertunggak, diblokir) | rudi@student.unhas.ac.id | mahasiswa123 |

Akun hanya untuk demo. Password disimpan sebagai hash bcrypt.

## Database

Enam tabel: `users`, `categories`, `books`, `announcements`, `loans`, `reviews`, ditambah view `v_loans_denda` untuk perhitungan keterlambatan dan denda secara runtime.

Aturan penting yang ditegakkan di level database:
- Email, NIM, ISBN, serta nama dan kode kategori bersifat unik
- Stok tersedia tidak boleh negatif dan tidak boleh melebihi stok total
- Mahasiswa tidak dapat memiliki dua pengajuan atau peminjaman aktif untuk buku yang sama
- Rating dibatasi 1 sampai 5, satu ulasan per mahasiswa per buku
- Buku dan pengguna yang memiliki transaksi tidak dapat dihapus (`ON DELETE RESTRICT`)

Alur status peminjaman: `Menunggu Konfirmasi` -> `Sedang Dipinjam` -> `Selesai`, atau `Menunggu Konfirmasi` -> `Ditolak`. Perubahan stok dilakukan dalam transaksi SQL.

## Struktur Folder

```text
database/            schema.sql dan seed.sql (di luar folder app, sesuai aturan tugas)
src/
  app/
    actions/         server actions (autentikasi)
    api/health/      endpoint uji koneksi database
    login/, register/
    admin/, pegawai/, mahasiswa/   dashboard per peran
  components/        komponen UI bersama
  lib/
    db.js            koneksi PostgreSQL (Pool) dan helper transaksi
    token.js         tanda tangan dan verifikasi token sesi
    session.js       baca/tulis cookie sesi
    auth.js          getCurrentUser dan requireRole
    validation.js    validasi form di sisi server
  proxy.js           proteksi route per peran sebelum halaman dirender
PROGRESS.md          catatan progres harian
```

## Catatan Keamanan

- Query selalu memakai parameter (`$1`, `$2`, ...) untuk mencegah SQL injection.
- Cookie sesi bersifat httpOnly dan ditandatangani; peran dicek ulang ke database pada setiap halaman terlindungi.
- File `.env.local` tidak boleh di-commit (sudah diabaikan oleh `.gitignore`).
