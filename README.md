# Manajemen Perpustakaan

Sistem manajemen perpustakaan kampus berbasis web: pengelolaan koleksi buku, pengumuman, dan transaksi peminjaman dengan hak akses per peran.

Proyek ini adalah **Tugas Final Praktikum Pemrograman Web 2026 (Individual Project 5)**.

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
| **Admin** | Mengelola akun pengguna dan kategori buku, **menambah dan menghapus buku**, meninjau request buku dari Mahasiswa, memantau statistik dan seluruh transaksi |
| **Pegawai** | Mengubah data dan stok buku, mengelola pengumuman, menyetujui/menolak peminjaman, memproses pengembalian dan pelunasan denda |
| **Mahasiswa** | Menelusuri katalog, mengajukan peminjaman dan perpanjangan, **meminta buku baru (request buku)**, memantau denda, memberi rating dan ulasan |
| **Guest** | Melihat katalog, detail buku, dan pengumuman tanpa login |

## Status Pengerjaan

Proyek dikerjakan dalam 8 hari (seluruh tahap selesai). Catatan lengkap ada di [`PROGRESS.md`](PROGRESS.md).

| Hari | Fokus | Status |
|---|---|---|
| 1 | Setup project dan desain database | Selesai |
| 2 | Autentikasi: register, login, sesi, proteksi route per role | Selesai |
| 3 | Admin: User Management dan Category Management | Selesai |
| 4 | Book Management dan katalog (filter, sorting) | Selesai |
| 5 | Pengumuman, homepage, detail buku, mode Guest | Selesai |
| 6 | Alur peminjaman (ajukan, approve/reject, pengembalian) | Selesai |
| 7 | Perpanjangan, denda, blokir pinjam, rating dan ulasan | Selesai |
| 8 | Dashboard 3 peran, responsivitas, pengujian, README final | Selesai |

### Sudah tersedia
- Register Mahasiswa dengan validasi email kampus (`.ac.id`), NIM, dan password
- Login dan logout untuk Admin, Pegawai, dan Mahasiswa
- Sesi cookie httpOnly bertanda tangan (role tidak dapat diubah dari browser)
- Proteksi halaman `/admin`, `/pegawai`, dan `/mahasiswa` sesuai peran
- Admin: manajemen user (filter role, tambah, edit, hapus dengan proteksi relasi) dan manajemen kategori buku
- Admin: tambah dan hapus buku (judul ganda dan ISBN ganda ditolak); Pegawai dan Admin: ubah data dan stok buku (stok transaksional)
- Deskripsi singkat per buku, tampil di halaman detail; 28 buku contoh dalam 9 kategori
- Request buku: Mahasiswa mengusulkan buku (maksimal 3 menunggu), Admin menyetujui atau menolak dengan catatan, lalu menambahkannya ke koleksi dengan data terisi otomatis
- Katalog publik dengan pencarian, filter kategori, sorting (judul, tahun terbit, rating), dan paginasi
- Pegawai/Admin: manajemen pengumuman (Draft/Published) dengan pratinjau draft
- Beranda (pencarian, 5 buku terpopuler, pengumuman terbaru), detail buku dengan ulasan, daftar dan detail pengumuman
- Pengajuan pinjam oleh Mahasiswa (diblokir bila ada denda tertunggak atau stok habis)
- Alur peminjaman: ajukan, Approve/Reject (dengan alasan), konfirmasi pengembalian; stok berubah lewat transaksi SQL dengan row lock
- Denda keterlambatan dihitung otomatis di database; pengajuan diblokir bila ada denda tertunggak
- Halaman Peminjaman Saya (Mahasiswa) dan meja peminjaman (Pegawai: antrean, sedang dipinjam, riwayat)
- Perpanjangan masa pinjam (maksimal 2 kali, hanya sebelum jatuh tempo) dengan persetujuan Pegawai
- Pencatatan pelunasan denda oleh Pegawai; pengajuan pinjam terbuka kembali setelah lunas
- Rating 1-5 dan ulasan setelah buku dikembalikan (satu ulasan per buku), tampil di detail buku
- Dashboard per peran: Mahasiswa (pinjaman aktif, perpanjangan, peringatan denda, riwayat), Pegawai (antrean dan pintasan), Admin (statistik sistem dan transaksi terbaru)
- Admin: monitoring seluruh transaksi dengan pencarian, filter status, dan paginasi
- Tampilan bertema streaming (hitam dengan aksen merah), slider poster Buku Terpopuler, kartu poster di katalog
- Tampilan responsif (diuji pada lebar 375px)
- Skema database 7 tabel, view hitung denda, dan data contoh
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
   - Database baru: jalankan `database/schema.sql`, lalu `database/seed.sql` (sudah termasuk 20 buku tambahan), lewat Query Tool pgAdmin atau terminal:
     ```bash
     psql -U postgres -d perpustakaan -f database/schema.sql
     psql -U postgres -d perpustakaan -f database/seed.sql
     ```
   - Database lama yang sudah berisi data (tanpa menghapusnya): jalankan `database/migrasi_hari9.sql`. Skrip ini menambah kolom deskripsi, tabel request buku, kategori baru, dan 20 buku baru; judul yang sudah ada dilewati sehingga tidak dobel, dan aman dijalankan berulang.
   - Sampul buku: `database/seed.sql` sudah memasang tautan gambar sampul untuk 28 buku. Di database lama, jalankan `database/sampul_buku.sql` (aman diulang; dicocokkan lewat judul). Sampul buku lain dapat diisi lewat kolom Tautan gambar sampul pada form buku.
   - Catatan: ISBN 20 buku tambahan (`978-602-1000-001` dst.) adalah nomor sementara, bukan ISBN asli.

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

Tujuh tabel: `users`, `categories`, `books`, `announcements`, `loans`, `reviews`, `book_requests`, ditambah view `v_loans_denda` untuk perhitungan keterlambatan dan denda secara runtime.

Aturan penting yang ditegakkan di level database:
- Email, NIM, ISBN, serta nama dan kode kategori bersifat unik
- Stok tersedia tidak boleh negatif dan tidak boleh melebihi stok total
- Mahasiswa tidak dapat memiliki dua pengajuan atau peminjaman aktif untuk buku yang sama
- Rating dibatasi 1 sampai 5, satu ulasan per mahasiswa per buku
- Buku dan pengguna yang memiliki transaksi tidak dapat dihapus (`ON DELETE RESTRICT`)

Alur status peminjaman: `Menunggu Konfirmasi` -> `Sedang Dipinjam` -> `Selesai`, atau `Menunggu Konfirmasi` -> `Ditolak`. Perubahan stok dilakukan dalam transaksi SQL.

## Struktur Folder

```text
database/            schema.sql, seed.sql, migrasi_hari9.sql, sampul_buku.sql (di luar folder app, sesuai aturan tugas)
src/
  app/
    actions/         server actions (auth, admin, books, announcements, loans, reviews)
    api/health/      endpoint uji koneksi database
    login/, register/
    admin/           dashboard Admin, users/, categories/ (CRUD), transactions/, requests/
    pegawai/         dashboard Pegawai, books/ (CRUD buku)
    mahasiswa/       dashboard Mahasiswa
    katalog/, buku/[id]/, pengumuman/   halaman publik (Guest dan Mahasiswa)
    pegawai/announcements/   CRUD pengumuman
    pegawai/loans/   antrean, perpanjangan, pengembalian, denda, riwayat
    mahasiswa/loans/ peminjaman saya, perpanjangan, [id]/review
    mahasiswa/requests/  request buku baru oleh Mahasiswa
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
- Setiap server action memeriksa ulang peran dan kepemilikan data; perubahan status memakai `UPDATE` bersyarat atau transaksi dengan row lock sehingga aksi ganda dari halaman basi tidak diproses dua kali.
- Pesan hasil aksi dipetakan dari kode tetap, bukan dari teks di URL; pola pencarian di-escape dan parameter urutan/filter memakai whitelist.

## Pengujian

Skenario yang diuji secara manual dan otomatis (Playwright) selama pengembangan:
- Akses per peran: Guest, Mahasiswa, Pegawai, dan Admin ke setiap area, termasuk pengalihan ke `/login`.
- Alur lengkap: ajukan, approve/reject, pengembalian, denda, pelunasan, perpanjangan, dan ulasan.
- Kasus tepi: stok terakhir diperebutkan dua Approve, aksi ganda dari halaman basi, data form dipalsukan (rating, id milik orang lain).
- Responsivitas pada lebar 375px untuk halaman utama semua peran.

## Deploy

Siapkan database PostgreSQL, isi `DATABASE_URL` dan `SESSION_SECRET` di environment hosting, jalankan `database/schema.sql` dan `database/seed.sql`, lalu `npm run build` dan `npm start`.
