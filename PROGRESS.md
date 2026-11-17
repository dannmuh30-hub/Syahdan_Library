# PROGRESS.md: Manajemen Perpustakaan

> Tempel file ini di awal setiap sesi baru dengan Claude agar konteks proyek tidak perlu dijelaskan ulang.

## Ringkasan Proyek
- Tugas Final Praktikum Pemrograman Web 2026, Individual Project 5: Manajemen Perpustakaan.
- Stack: Next.js (JSX, App Router), Tailwind CSS, PostgreSQL + `pg` (Raw SQL, parameterized query `$1, $2`).
- Role: admin, pegawai, mahasiswa, guest (tanpa akun).
- Deadline tugas: 25 November 2026 (commit terakhir di GitHub yang dinilai).
- Penilaian: Frontend 30%, Backend 30%, Kelengkapan fitur 40%.
- Aturan: file `.sql` disimpan di luar folder `/app`. Proyek akan dipresentasikan 15 menit + 15 menit tanya jawab.

## Keputusan Desain
| Topik | Keputusan | Alasan |
|---|---|---|
| Password | Hash bcrypt (`bcryptjs`), kolom `password_hash` | Bab 10 memakai plaintext hanya untuk belajar; nilai Backend mencakup autentikasi |
| Sesi login | Cookie sesi (mulai Hari 2), bukan `localStorage` | Role di `localStorage` bisa diubah lewat DevTools |
| Status pinjam | `Menunggu Konfirmasi`, `Sedang Dipinjam`, `Ditolak`, `Selesai` | Sesuai alur spesifikasi, plus Ditolak untuk Reject |
| Perpanjangan | Kolom terpisah `status_perpanjangan` di tabel `loans` | Perpanjangan terjadi saat status masih `Sedang Dipinjam` |
| Denda | Dihitung runtime lewat view `v_loans_denda`; `denda_nominal` dikunci saat buku dikembalikan | Spesifikasi: runtime calculation di backend |
| Blokir pinjam | Cek `EXISTS` loans dengan `status_denda = 'Tertunggak'` milik mahasiswa | Spesifikasi blokir peminjaman |
| Hapus user | FK `ON DELETE RESTRICT` ke loans; akun dengan riwayat dinonaktifkan lewat `is_active` | Mencegah hilangnya riwayat denda |
| Pinjam ganda | Unique index parsial `uq_loan_aktif` (user + buku, status aktif) | Cegah dua pengajuan aktif untuk buku yang sama |
| Stok | `stok_tersedia` diubah dalam transaksi (`withTransaction` di `src/lib/db.js`) | Spesifikasi: stok berubah secara transaksional |
| Buku terpopuler | Hitung loans berstatus `Sedang Dipinjam` / `Selesai` per buku, ambil 5 teratas | Spesifikasi: `JOIN` + `COUNT` |

## Skema Database (ringkas)
```text
users(id, nama, email*, password_hash, role, nomor_identitas*, is_active)
categories(id, nama*, kode*, deskripsi)
books(id, judul, isbn*, pengarang, penerbit, tahun_terbit, category_id->categories,
      stok_total, stok_tersedia, durasi_maks_pinjam, denda_per_hari, cover_url)
announcements(id, judul, konten, kategori, tanggal_rilis, status, author_id->users)
loans(id, user_id->users, book_id->books, status, alasan_penolakan,
      tanggal_pengajuan, tanggal_pinjam, tanggal_jatuh_tempo, tanggal_kembali,
      status_perpanjangan, jumlah_perpanjangan, denda_nominal, status_denda,
      approved_by->users, returned_by->users)
reviews(id, loan_id*->loans, user_id, book_id, rating 1-5, komentar; unique user+book)
VIEW v_loans_denda(loan_id, ..., hari_terlambat, denda_hitung)
(* = unique)
```

## Rencana 8 Hari

| Hari | Fokus | Status |
|---|---|---|
| 1 | Setup + desain database | Selesai |
| 2 | Autentikasi: register, login, cookie sesi, proteksi route per role | Selesai |
| 3 | Admin: User Management + Category Management | Belum |
| 4 | Book Management + Katalog (filter, sorting) | Belum |
| 5 | Pengumuman + Homepage + Detail buku + mode Guest | Belum |
| 6 | Alur peminjaman (ajukan, approve/reject, pengembalian) | Belum |
| 7 | Perpanjangan, denda, blokir pinjam, rating dan ulasan | Belum |
| 8 | Dashboard 3 role + responsivitas + uji semua role + README final | Belum |

Cadangan: 19-24 November untuk bug dan fitur opsional (reservasi, notifikasi, export CSV).

## Log Harian (salin ke laporan progres GitHub)

### Hari 1 (10 November 2026): Setup dan Desain Database
- Membuat project Next.js (JavaScript, Tailwind, App Router, `src/`) dan repository GitHub.
- Merancang skema PostgreSQL 6 tabel (users, categories, books, announcements, loans, reviews) beserta constraint, index, dan view hitung denda.
- Menyiapkan `database/schema.sql` dan `database/seed.sql` (akun 3 role, 8 buku, skenario peminjaman, denda, dan ulasan).
- Membuat koneksi database `src/lib/db.js` (Pool + helper transaksi) dan endpoint uji `/api/health`.

Contoh pesan commit:
```text
chore: inisialisasi project Next.js dan struktur folder
feat(db): tambah skema PostgreSQL dan seed data perpustakaan
feat(db): tambah koneksi pg Pool dan helper transaksi
feat(api): tambah endpoint /api/health untuk uji koneksi
docs: tambah README dan PROGRESS
```

### Hari 2 (11 November 2026): Autentikasi
- Membuat register Mahasiswa dengan validasi server (nama, email kampus `.ac.id`, NIM, password minimal 8 karakter, konfirmasi) dan penanganan email/NIM duplikat.
- Membuat login dengan bcrypt, pesan error generik, dan pengecekan akun aktif.
- Menerapkan sesi cookie httpOnly bertanda tangan HMAC (`src/lib/token.js`, `src/lib/session.js`), bukan `localStorage`.
- Menambahkan proteksi route per role: `src/proxy.js` (cek cepat) dan `requireRole()` di `src/lib/auth.js` (cek ke database).
- Membuat halaman `/login`, `/register`, tombol Continue as Guest, logout, dan dashboard sementara `/admin`, `/pegawai`, `/mahasiswa`.
- Menguji 28 skenario end-to-end (login 3 role, akses lintas role, cookie dipalsukan, register valid/duplikat/tidak valid, logout); build produksi dan lint lulus.

Contoh pesan commit:
```text
feat(auth): tambah validasi dan server action register mahasiswa
feat(auth): tambah login dengan bcrypt dan sesi cookie bertanda tangan
feat(auth): tambah proxy dan requireRole untuk proteksi route per role
feat(ui): tambah halaman login, register, dan dashboard sementara per role
docs: perbarui PROGRESS Hari 2
```

## Akun Demo
Lihat tabel di `README.md`. Password: admin123 / pegawai123 / mahasiswa123.
