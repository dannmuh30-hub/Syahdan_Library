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
| 3 | Admin: User Management + Category Management | Selesai |
| 4 | Book Management + Katalog (filter, sorting) | Selesai |
| 5 | Pengumuman + Homepage + Detail buku + mode Guest | Selesai |
| 6 | Alur peminjaman (ajukan, approve/reject, pengembalian) | Selesai |
| 7 | Perpanjangan, denda, blokir pinjam, rating dan ulasan | Selesai |
| 8 | Dashboard 3 role + responsivitas + uji semua role + README final | Selesai |

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

### Hari 3 (11 November 2026): User Management dan Category Management
- Membuat User Management (Admin): daftar user dengan filter role, tambah user, edit (nama, email, role, status aktif), dan hapus.
- Validasi: semua field wajib, format email, email dan NIM unik, password minimal 8 karakter; NIM tidak dapat diubah saat edit.
- Proteksi: admin tidak dapat menghapus, menurunkan role, atau menonaktifkan akunnya sendiri; user dengan transaksi aktif atau riwayat transaksi tidak dapat dihapus (dinonaktifkan saja).
- Membuat Category Management: daftar dengan jumlah buku per kategori (`LEFT JOIN` + `COUNT`), tambah, edit, hapus; kategori yang masih dipakai buku tidak dapat dihapus.
- Setiap server action mengecek ulang role Admin (`requireRole`), tidak hanya mengandalkan proxy.
- Memperbaiki dua bug: pilihan role kembali ke default setelah form gagal validasi, dan `id` field ganda antar halaman (kini memakai `useId`).
- Menguji 41 skenario end-to-end Hari 3 plus regresi Hari 2; build produksi dan lint lulus.

Contoh pesan commit:
```text
feat(admin): tambah validasi dan server action user management
feat(admin): tambah halaman daftar, tambah, dan edit user
feat(admin): tambah proteksi hapus user dan pembatasan aksi pada akun sendiri
feat(admin): tambah category management dengan proteksi hapus
fix(ui): pertahankan pilihan select setelah validasi gagal
docs: perbarui PROGRESS Hari 3
```

### Hari 4 (11 November 2026): Book Management dan Katalog
- Membuat Book Management untuk Pegawai dan Admin di `/pegawai/books`: daftar dengan pencarian (judul, pengarang, ISBN), tambah, edit, dan hapus.
- Validasi: semua field wajib, ISBN unik dan tidak dapat diubah, tahun terbit valid, stok/denda >= 0, durasi 1-365 hari, tautan sampul harus http/https (opsional).
- Edit stok: `stok_tersedia` disesuaikan dalam transaksi SQL (`FOR UPDATE`); stok total tidak boleh kurang dari jumlah yang sedang dipinjam.
- Proteksi hapus: buku yang sedang dipinjam atau punya pengajuan menunggu tidak dapat dihapus; buku dengan riwayat peminjaman juga ditolak (relasi `ON DELETE RESTRICT`).
- Membuat katalog publik `/katalog` untuk Guest dan Mahasiswa: sampul, judul, penulis, kategori, stok, rating rata-rata (`LEFT JOIN` + `AVG`), filter kategori, pencarian, sorting (judul, tahun terbit, rating tertinggi), dan paginasi 12 buku per halaman.
- Parameter URL dibatasi daftar putih dan pola `ILIKE` di-escape; tombol Continue as Guest kini menuju katalog.
- Memperbaiki dua bug yang ditemukan pengujian: error SQL tipe parameter pada edit stok, dan pembacaan database di luar `<Suspense>` pada halaman katalog.
- Menguji 50 skenario end-to-end Hari 4 plus regresi Hari 2-3; build produksi dan lint lulus.

Catatan: kartu buku di katalog belum bisa diklik; halaman detail buku dibuat di Hari 5.

Contoh pesan commit:
```text
feat(books): tambah validasi dan server action CRUD buku
feat(books): tambah halaman daftar, tambah, dan edit buku untuk Pegawai dan Admin
feat(books): sesuaikan stok tersedia secara transaksional saat edit stok
feat(catalog): tambah katalog publik dengan filter, sorting, pencarian, dan paginasi
fix(books): beri cast tipe pada parameter SQL edit stok
docs: perbarui PROGRESS Hari 4
```

### Hari 5 (11 November 2026): Pengumuman, Homepage, Detail Buku, Mode Guest
- Membuat Announcement Management (Pegawai dan Admin) di `/pegawai/announcements`: daftar dengan filter status, tambah, edit, hapus; field judul, isi, kategori (Operasional/Layanan/Acara), tanggal rilis, status (Draft/Published); penulis tercatat otomatis.
- Membuat halaman publik `/pengumuman` (hanya Published) dan `/pengumuman/[id]`; Draft hanya dapat dilihat Pegawai/Admin sebagai pratinjau, selain itu 404.
- Membuat homepage: pencarian cepat (menuju katalog), 5 buku terpopuler (`JOIN` + `COUNT` transaksi Sedang Dipinjam/Selesai), dan 3 pengumuman Published terbaru.
- Membuat halaman detail buku `/buku/[id]`: metadata lengkap, rating, daftar ulasan, dan tombol Ajukan Pinjam yang hanya aktif untuk Mahasiswa tanpa denda tertunggak, stok > 0, dan tanpa pengajuan/peminjaman aktif atas buku yang sama; Guest diarahkan masuk, Pegawai/Admin melihat keterangan.
- Menambahkan aksi pengajuan pinjam (status awal Menunggu Konfirmasi; stok baru berkurang saat Approve di Hari 6) dengan pengecekan blokir denda di server.
- Mode Guest: katalog, detail buku, pengumuman, dan beranda dapat dibuka tanpa login; judul buku di katalog kini menuju detail.
- Tanggal ditampilkan dari `to_char` agar tidak bergeser zona waktu; pesan hasil aksi memakai kode tetap (bukan teks dari URL).
- Menguji 47 skenario end-to-end Hari 5 plus regresi Hari 2-4; build produksi dan lint lulus.

Contoh pesan commit:
```text
feat(announcements): tambah validasi dan server action CRUD pengumuman
feat(announcements): tambah halaman kelola pengumuman untuk Pegawai dan Admin
feat(announcements): tambah daftar dan detail pengumuman publik dengan pratinjau draft
feat(home): tambah beranda dengan pencarian, buku terpopuler, dan pengumuman terbaru
feat(books): tambah halaman detail buku dengan ulasan dan tombol Ajukan Pinjam
feat(loans): tambah aksi pengajuan pinjam dengan blokir denda tertunggak
docs: perbarui PROGRESS Hari 5
```

### Hari 6 (12 November 2026): Alur Peminjaman
- Membuat halaman Pegawai `/pegawai/loans` dengan tiga tab: Antrean (pengajuan Menunggu Konfirmasi), Sedang Dipinjam (meja pengembalian), dan Riwayat; semuanya dapat dicari berdasarkan nama, NIM, atau judul.
- Approve dalam satu transaksi SQL: baris `loans` lalu `books` dikunci (`FOR UPDATE`), stok berkurang 1, status menjadi Sedang Dipinjam, `tanggal_pinjam` hari ini, jatuh tempo = hari ini + durasi maksimal buku.
- Approve ditolak bila stok habis, bila pengajuan sudah diproses pegawai lain, atau bila mahasiswa masih punya denda tertunggak.
- Reject mewajibkan alasan (3-300 karakter) yang tersimpan dan tampil ke mahasiswa.
- Pengembalian dalam satu transaksi: stok bertambah 1, `tanggal_kembali` dicatat, dan keterlambatan dihitung di database (hari ini - jatuh tempo) x denda per hari; bila terlambat, `denda_nominal` dan status Tertunggak langsung tercatat.
- Denda berjalan pada buku yang belum dikembalikan dihitung runtime lewat view `v_loans_denda`.
- Membuat halaman Mahasiswa `/mahasiswa/loans`: pinjaman aktif (jatuh tempo, keterlambatan, denda berjalan) dan riwayat (alasan penolakan, denda), hanya milik sendiri.
- Menguji 49 skenario end-to-end Hari 6, termasuk aksi dari halaman basi (tidak ada pengurangan atau penambahan stok ganda) dan balapan dua Approve atas stok terakhir (tepat satu berhasil, stok tidak negatif); regresi Hari 2-5, build produksi, dan lint lulus.

Catatan: pelunasan denda (Tertunggak -> Lunas), perpanjangan, dan ulasan dibuat di Hari 7.

Contoh pesan commit:
```text
feat(loans): tambah approve peminjaman dengan transaksi SQL dan row lock
feat(loans): tambah reject dengan alasan dan proteksi pengajuan yang sudah diproses
feat(loans): tambah konfirmasi pengembalian dengan perhitungan denda keterlambatan
feat(loans): tambah halaman antrean, meja pengembalian, dan riwayat untuk Pegawai
feat(loans): tambah halaman Peminjaman Saya untuk Mahasiswa
docs: perbarui PROGRESS Hari 6
```

### Hari 7 (12 November 2026): Perpanjangan, Pelunasan Denda, Rating dan Ulasan
- Perpanjangan masa pinjam: Mahasiswa menekan Ajukan Perpanjangan di `/mahasiswa/loans`. Aturan (ditegakkan di server dengan satu `UPDATE` bersyarat): hanya untuk buku Sedang Dipinjam, maksimal 2 kali (`MAX_PERPANJANGAN` di `src/lib/rules.js`), hanya sebelum jatuh tempo, dan tidak boleh bila pengajuan sebelumnya masih menunggu. Tombol diganti alasan bila tidak memenuhi syarat.
- Pegawai: tab baru Perpanjangan di `/pegawai/loans` (jatuh tempo saat ini, perpanjangan ke-n, jatuh tempo baru). Setujui menambah jatuh tempo sebesar durasi maksimal buku dan menambah hitungan perpanjangan; Tolak membiarkan jatuh tempo. Aksi dari halaman basi tidak diproses dua kali.
- Pencatatan pelunasan denda: tab baru Denda berisi pengembalian dengan denda Tertunggak; Tandai Lunas (dengan konfirmasi) mengubah status menjadi Lunas sehingga blokir pengajuan pinjam Mahasiswa terbuka kembali.
- Rating dan ulasan: halaman `/mahasiswa/loans/[id]/review` hanya untuk peminjaman milik sendiri berstatus Selesai (selain itu 404). Rating 1-5 dan komentar 3-1000 karakter divalidasi di server, satu ulasan per mahasiswa per buku. Ulasan tampil di detail buku dan memengaruhi rata-rata rating katalog.
- Tab Sedang Dipinjam kini memuat kolom status perpanjangan; label tab menampilkan jumlah antrean, perpanjangan, dan denda.
- Menguji skenario end-to-end Hari 7 (pengajuan ganda, batas 2x, lewat jatuh tempo, id dipalsukan, setujui/tolak ganda, pelunasan ganda, rating palsu, ulasan ganda, kepemilikan 404) plus regresi Hari 2-6; build produksi dan lint lulus.

Catatan: dashboard tiga peran, responsivitas, dan pengujian akhir dikerjakan di Hari 8.

Contoh pesan commit:
```text
feat(loans): tambah aturan dan aksi pengajuan perpanjangan oleh Mahasiswa
feat(loans): tambah tab Perpanjangan untuk Pegawai (setujui dan tolak)
feat(loans): tambah pencatatan pelunasan denda dan tab Denda
feat(reviews): tambah validasi, aksi, dan halaman ulasan setelah pengembalian
feat(loans): tampilkan status perpanjangan dan tautan ulasan di Peminjaman Saya
docs: perbarui PROGRESS Hari 7
```

### Hari 8 (12 November 2026): Dashboard Tiga Peran, Responsivitas, Pengujian Akhir
- Dashboard Mahasiswa `/mahasiswa`: kartu ringkas (sedang dipinjam, menunggu konfirmasi, buku selesai, denda tertunggak), peringatan denda tertunggak dan buku terlambat, daftar peminjaman aktif dengan jatuh tempo dan tombol Perpanjang, serta riwayat terbaru dengan tautan Tulis ulasan.
- Dashboard Pegawai `/pegawai`: kartu antrean, perpanjangan, sedang dipinjam, terlambat, denda tertunggak, dan stok habis (masing-masing menuju tab terkait), antrean terlama, dan pintasan ke peminjaman, buku, pengumuman.
- Dashboard Admin `/admin`: statistik agregat (pengguna per peran, judul dan eksemplar, kategori, transaksi per status, denda tertunggak dan lunas), transaksi terbaru, dan menu ke seluruh modul.
- Halaman baru `/admin/transactions`: monitoring seluruh transaksi dengan pencarian (nama, NIM, judul), filter status, dan paginasi 20 baris; parameter divalidasi (status whitelist, pola pencarian di-escape, nomor halaman dibatasi).
- Responsivitas: memperbaiki lebar kerangka halaman (`w-full`) yang membuat halaman Pegawai dan Admin melebar melebihi layar ponsel; tabel tetap dapat digeser horizontal di dalam kartunya.
- Menguji end-to-end semua peran: isi dashboard, matriks akses Guest/Mahasiswa/Pegawai/Admin, monitoring transaksi, dan 375px tanpa scroll horizontal di semua halaman utama; regresi Hari 2-7, build produksi, dan lint lulus.

Contoh pesan commit:
```text
feat(dashboard): bangun dashboard Mahasiswa dengan peringatan denda dan aksi perpanjang
feat(dashboard): bangun dashboard Pegawai dengan antrean dan pintasan
feat(dashboard): bangun dashboard Admin dengan statistik agregat
feat(admin): tambah monitoring seluruh transaksi dengan filter dan paginasi
fix(ui): perbaiki lebar kerangka halaman agar tidak melebar di layar ponsel
docs: finalisasi README dan PROGRESS Hari 8
```

### Penyempurnaan Tampilan (14 November 2026): Tema Streaming
- Mengikuti desain referensi (platform streaming): latar hitam dengan cahaya merah, kartu poster, dan slider coverflow (kartu tengah paling besar, kartu samping mengecil dan redup, rating di pojok kanan atas, judul dan chip di bawah).
- Tema global lewat `@theme` Tailwind di `globals.css`: palet stone digeser menjadi abu gelap dan amber menjadi merah aksen, sehingga seluruh halaman (publik, Mahasiswa, Pegawai, Admin) otomatis konsisten tanpa mengubah logika.
- Komponen baru: `BookCover` (sampul gradasi per kategori bila `cover_url` kosong), `BookSlider` (autoplay 3,5 detik, berhenti saat disentuh/fokus atau lewat tombol Jeda, panah kiri/kanan, tanpa animasi bila pengguna meminta pengurangan gerak), dan `StatCard` tetap dipakai dashboard.
- Beranda: Buku Terpopuler kini slider selebar layar; Katalog: grid kartu poster yang seluruh areanya dapat diklik; Detail Buku: poster dengan cahaya merah.
- Menguji slider (klik kartu samping, kartu tengah, tombol, keyboard, autoplay, Jeda, reduced-motion, 375px) plus regresi seluruh skenario Hari 2-8; build produksi dan lint lulus.

Contoh pesan commit:
```text
style: terapkan tema gelap bergaya streaming lewat palet global Tailwind
feat(ui): tambah BookCover dan slider coverflow Buku Terpopuler di beranda
style(catalog): ubah kartu katalog menjadi kartu poster yang dapat diklik penuh
style(book): tampilkan poster berlatar cahaya merah di detail buku
docs: perbarui PROGRESS penyempurnaan tampilan
```

### Pengembangan Lanjutan (17 November 2026): Akses Admin untuk Buku, Request Buku, Data Buku Tambahan
- Tambah dan hapus buku sekarang hanya untuk Admin (dicek di halaman dan di server action; Pegawai yang memanggil action langsung ditolak). Pegawai tetap dapat mengubah data dan stok buku. Tombol Tambah/Hapus disembunyikan dari Pegawai dan `/pegawai/books/new` mengalihkannya dengan pesan.
- Penambahan buku menolak judul ganda (tanpa membedakan huruf besar/kecil) selain ISBN ganda.
- Kolom baru `books.deskripsi` (opsional, maks 1000 karakter): ada di form tambah/ubah dan tampil di detail buku.
- Fitur Request Buku: tabel `book_requests` (status Menunggu, Disetujui, Ditolak, Ditambahkan). Hanya Mahasiswa yang dapat mengajukan (judul dan pengarang wajib, maksimal 3 request menunggu, judul yang sudah ada di katalog atau sudah diminta ditolak) dan membatalkan request miliknya sendiri. Admin meninjau di `/admin/requests` (tolak wajib dengan catatan), lalu menambahkan buku dari request yang disetujui; formulir terisi otomatis dari database dan request berubah menjadi Ditambahkan. Aksi ganda dari halaman basi ditolak (UPDATE bersyarat).
- Data: 20 buku baru (5 kategori baru) di `seed.sql`, plus `migrasi_hari9.sql` untuk database lama (idempotent dan melewati judul yang sudah ada). ISBN buku baru adalah nomor sementara.
- Dashboard Admin memiliki kartu Request buku menunggu; navigasi Admin dan Mahasiswa memuat menu Request Buku.
- Menguji 30+ skenario baru (akses per peran, panggilan action langsung, validasi, alur request sampai buku tertambah, judul/ISBN ganda, tampilan 375px) dan regresi seluruh skenario lama; build produksi dan lint lulus.

Contoh pesan commit:
```text
feat(books): batasi tambah dan hapus buku hanya untuk Admin
feat(books): tambah kolom deskripsi dan tolak judul ganda
feat(requests): tambah tabel book_requests dan form request buku Mahasiswa
feat(requests): tambah halaman tinjauan request untuk Admin dan tambah buku dari request
feat(db): tambah 20 buku baru dan skrip migrasi idempotent
docs: perbarui README dan PROGRESS
```

### Sampul Buku (18 November 2026)
- Tautan gambar sampul 28 buku dipasang lewat `database/sampul_buku.sql` (UPDATE berdasarkan judul, aman diulang) dan disertakan di `seed.sql`. Buku tanpa sampul tetap memakai sampul gradasi bawaan.
- 5 buku sisanya (Basis Data, Bumi Manusia, Cantik Itu Luka, Dear Debbie, Dunia Sophie) menyusul sehingga seluruh 28 buku kini bersampul.

Contoh pesan commit:
```text
feat(db): tambah skrip sampul_buku.sql untuk 28 buku
docs: catat sampul buku di README dan PROGRESS
```

### Penanda Menu Aktif pada Navbar (19 November 2026)
- Komponen baru `NavLinks` menandai halaman yang sedang dibuka dengan pil merah solid dan `aria-current="page"`; menu lain berwarna abu dan berubah saat disorot. Dipakai di navbar publik, Mahasiswa, Pegawai, dan Admin.
- Aturan aktif: Dashboard/Beranda hanya aktif pada path yang sama persis; menu lain juga aktif di sub-halamannya (mis. Peminjaman Saya aktif di halaman ulasan, Katalog aktif di detail buku).
- Navbar publik dibungkus `Suspense` karena halaman publik di-prerender (ditemukan saat build produksi dan diperbaiki).
- Menguji 25 kombinasi halaman dan peran, warna aktif versus tidak aktif, dan 375px; regresi, build produksi, dan lint lulus.

Contoh pesan commit:
```text
feat(ui): tambah NavLinks dengan penanda menu aktif di semua navbar
fix(ui): bungkus navbar publik dengan Suspense agar build produksi lolos
docs: catat penanda menu aktif di PROGRESS
```

## Akun Demo
Lihat tabel di `README.md`. Password: admin123 / pegawai123 / mahasiswa123.
