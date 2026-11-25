# Manajemen Perpustakaan

Sistem manajemen perpustakaan kampus berbasis web: pengelolaan koleksi buku, pengumuman, dan transaksi peminjaman dengan hak akses per peran.

Proyek ini adalah **Tugas Final Praktikum Pemrograman Web 2026 (Individual Project 5)**.

## Daftar Isi

1. [Teknologi](#teknologi)
2. [Gambaran Singkat Peran](#gambaran-singkat-peran)
3. [Cara Menjalankan](#cara-menjalankan) dan [Akun Demo](#akun-demo)
4. [Alur Tiap Peran (penjelasan lengkap)](#alur-tiap-peran)
   - [Guest](#1-guest-pengunjung-tanpa-login) · [Mahasiswa](#2-mahasiswa) · [Pegawai](#3-pegawai) · [Admin](#4-admin)
5. [Aturan Bisnis](#aturan-bisnis-ringkasan)
6. [Alur Status](#alur-status)
7. [Fitur Umum (Profil, Tema, Navigasi)](#fitur-umum)
8. [Database, Struktur Folder, Keamanan, Pengujian](#database)

## Teknologi

| Bagian | Teknologi |
|---|---|
| Framework | Next.js (App Router, JSX) |
| Styling | Tailwind CSS (tema gelap bawaan, tema terang tersedia) |
| Database | PostgreSQL dengan Raw SQL (library `pg`) |
| Autentikasi | Password hash `bcryptjs`, sesi cookie httpOnly bertanda tangan HMAC |

## Gambaran Singkat Peran

| Peran | Cara masuk | Bisa apa (ringkas) | Tidak bisa |
|---|---|---|---|
| **Guest** | Tanpa login | Melihat beranda, katalog, detail buku, ulasan, dan pengumuman | Meminjam, meminta buku, membuka dashboard |
| **Mahasiswa** | Daftar sendiri di `/register` lalu login | Meminjam, memperpanjang, membayar denda lewat Pegawai, memberi ulasan, meminta buku baru, mengatur profil | Mengelola buku atau user |
| **Pegawai** | Dibuatkan Admin | Memproses peminjaman (setujui/tolak/kembali/perpanjang/lunas), mengelola buku (tambah, ubah, hapus) dan pengumuman, mengatur profil | Mengelola user, kategori, request buku |
| **Admin** | Akun tunggal bawaan | Mengelola user dan kategori, meninjau request buku, memantau semua transaksi, plus menu operasional Pegawai | Melihat katalog/halaman publik (otomatis dialihkan ke dashboard), mengubah/menghapus akun Admin |

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
   - Database lama tanpa fitur foto profil: jalankan `database/migrasi_foto_profil.sql` (menambah kolom foto di tabel `users`).
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

## Alur Tiap Peran

Bagian ini menjelaskan, langkah demi langkah, apa yang dilihat dan dilakukan tiap peran, serta apa yang terjadi di sistem pada setiap langkah.

### 1. Guest (pengunjung tanpa login)

Guest adalah siapa pun yang membuka situs tanpa masuk akun.

**Halaman yang bisa dibuka**

| Halaman | Alamat | Isi |
|---|---|---|
| Beranda | `/` | Pencarian cepat, slider *Buku Terpopuler* (tombol **Lihat Semua** menuju katalog), pengumuman terbaru, footer |
| Katalog | `/katalog` | Daftar buku, pencarian, filter kategori, urutan, paginasi. Ada tombol **← Kembali ke Beranda** di bagian atas |
| Detail buku | `/buku/[id]` | Sampul, data buku, deskripsi, stok, rating rata-rata, daftar ulasan |
| Pengumuman | `/pengumuman` | Daftar dan detail pengumuman berstatus Published |
| Login / Daftar | `/login`, `/register` | Form masuk dan pendaftaran |

**Alur Guest**

1. Membuka situs, selalu mendarat di **Beranda** (landing page).
2. Menelusuri buku lewat kolom pencarian, slider populer, atau **Lihat Semua** ke katalog.
3. Di katalog: memilih **kategori** atau **urutan** (judul, tahun terbit, rating); hasil langsung diterapkan tanpa menekan tombol. Tombol **Reset** (merah) mengembalikan pencarian, kategori, dan urutan ke awal. Tombol **← Kembali ke Beranda** membawa kembali ke landing page.
4. Membuka detail buku untuk membaca deskripsi dan ulasan.
5. Menekan **Pinjam** atau membuka halaman yang butuh akun: sistem mengarahkan ke `/login`. Setelah login, pengguna masuk ke dashboard sesuai perannya.

Guest yang mencoba membuka `/admin`, `/pegawai`, `/mahasiswa`, atau `/profil` otomatis dialihkan ke `/login`.

### 2. Mahasiswa

#### 2.1 Mendaftar dan masuk

1. Buka `/register` dan isi form. Aturan isian:
   - **Nama lengkap**: 3-100 karakter, **tidak boleh mengandung angka** atau karakter yang tidak lazim untuk nama.
   - **Email**: wajib email kampus berakhiran `.ac.id`; bagian sebelum `@` hanya boleh **huruf dan angka** (titik pemisah domain tetap diperbolehkan).
   - **NIM**: huruf besar/angka, 5-20 karakter, harus unik.
   - **Password**: 8-72 karakter. Ikon mata di kolom password dipakai untuk **melihat/menyembunyikan** password yang diketik.
2. Jika ada kesalahan, pesan muncul di bawah kolom yang bermasalah dan isian lain tidak hilang.
3. Setelah berhasil, login di `/login`. Sistem membuat sesi dan membawa Mahasiswa ke **Dashboard Mahasiswa**. Akun baru selalu berperan Mahasiswa; peran lain tidak bisa dipilih lewat pendaftaran.

#### 2.2 Menu sidebar Mahasiswa

Dashboard · Peminjaman Saya · Request Buku · Katalog · Pengumuman · Profil Saya

#### 2.3 Dashboard

Menampilkan kartu ringkasan: **Sedang dipinjam**, **Menunggu konfirmasi**, **Buku selesai dibaca**, **Denda tertunggak**; daftar **Peminjaman aktif** (dengan jatuh tempo dan tanda terlambat); serta **Riwayat terbaru**. Bila ada denda tertunggak, muncul peringatan yang menjelaskan bahwa peminjaman baru diblokir.

#### 2.4 Meminjam buku (alur utama)

1. Buka **Katalog**, cari buku, buka detailnya.
2. Tekan **Ajukan Pinjam**. Sistem memeriksa:
   - tidak ada **denda tertunggak** (jika ada, ditolak dengan pesan),
   - **stok tersedia** lebih dari 0,
   - belum punya pengajuan/peminjaman **aktif** untuk buku yang sama (satu buku satu pinjaman aktif).
3. Jika lolos, pinjaman dibuat dengan status **Menunggu Konfirmasi**. Stok belum berkurang pada tahap ini.
4. Pantau di **Peminjaman Saya**. Dua kemungkinan:
   - **Ditolak** oleh Pegawai: alasan penolakan ditampilkan. Mahasiswa boleh mengajukan lagi.
   - **Disetujui**: status menjadi **Sedang Dipinjam**, stok berkurang satu, tanggal pinjam dan **jatuh tempo** terisi (tanggal pinjam + durasi maksimal pinjam buku itu).
5. Ambil buku di perpustakaan, baca, lalu kembalikan ke Pegawai. Pegawai menekan konfirmasi pengembalian: status menjadi **Selesai**, stok bertambah satu.

#### 2.5 Memperpanjang masa pinjam

1. Di **Peminjaman Saya**, pada pinjaman berstatus Sedang Dipinjam tekan **Ajukan Perpanjangan**.
2. Syarat: **belum lewat jatuh tempo**, belum ada pengajuan perpanjangan lain yang menunggu, dan **maksimal 2 kali** perpanjangan per pinjaman. Jika tidak memenuhi, sistem memberi pesan sebab penolakannya.
3. Pegawai menyetujui atau menolak. Bila **disetujui**, jatuh tempo bertambah sebesar durasi maksimal pinjam buku tersebut dan hitungan perpanjangan naik satu. Bila **ditolak**, jatuh tempo tidak berubah.

#### 2.6 Keterlambatan dan denda

- Jika buku dikembalikan setelah jatuh tempo, **denda = jumlah hari terlambat x tarif denda per hari** buku tersebut. Nilai denda dikunci saat pengembalian dicatat.
- Status denda: **Tertunggak** (belum dibayar) lalu **Lunas** (setelah Pegawai mencatat pelunasan). Jika tidak terlambat, denda "Tidak Ada".
- Selama ada denda **Tertunggak**, Mahasiswa **tidak bisa mengajukan pinjaman baru** (dan pengajuan lama tidak bisa disetujui). Bayar di meja Pegawai; setelah Pegawai menandai Lunas, akses terbuka kembali.

#### 2.7 Memberi rating dan ulasan

Setelah pinjaman **Selesai**, tombol ulasan muncul di Peminjaman Saya. Pilih rating 1-5 bintang dan tulis ulasan. Satu Mahasiswa hanya dapat mengulas **satu buku satu kali**. Ulasan tampil di halaman detail buku (bintang rating berada di bawah judul pada kartu buku).

#### 2.8 Request buku baru

1. Buka **Request Buku**, isi judul, pengarang, penerbit, tahun terbit, dan alasan usulan.
2. Maksimal **3 request berstatus Menunggu** sekaligus. Request yang masih Menunggu boleh dibatalkan sendiri.
3. **Admin** meninjau: **Disetujui** (lalu ditambahkan ke koleksi) atau **Ditolak** dengan catatan. Hasil dan catatan Admin terlihat di halaman Request Buku.
4. Hanya Mahasiswa yang dapat mengajukan request.

#### 2.9 Profil

Menu **Profil** (di pojok kanan atas, juga **Profil Saya** di sidebar) berisi: ubah nama dan email (aturan sama dengan pendaftaran), ubah password (wajib mengisi password lama), serta **foto profil** (unggah JPG/PNG/WebP maks 2 MB, hapus untuk kembali ke inisial). Dropdown profil memuat **Dashboard** dan **Keluar**.

### 3. Pegawai

Akun Pegawai **dibuat oleh Admin** (lewat Manajemen User) atau berasal dari Mahasiswa yang dipromosikan Admin (lihat 4.2).

#### 3.1 Menu sidebar Pegawai

Dashboard · Peminjaman · Buku · Pengumuman · Lihat Katalog · Profil Saya

#### 3.2 Dashboard

Kartu: **Antrean**, **Perpanjangan**, **Sedang dipinjam**, **Terlambat**, **Denda tertunggak**, **Stok habis**. Setiap kartu menjadi pintasan ke tab yang bersangkutan. Di bawahnya ada daftar **Antrean terlama** agar permintaan yang paling lama menunggu diproses lebih dahulu.

#### 3.3 Meja Peminjaman (`/pegawai/loans`) per tab

| Tab | Isi | Aksi Pegawai |
|---|---|---|
| **Antrean** | Pengajuan pinjam berstatus Menunggu Konfirmasi | **Setujui** atau **Tolak** (alasan wajib, maks 500 karakter) |
| **Perpanjangan** | Pinjaman dengan perpanjangan diajukan | **Setujui** atau **Tolak** |
| **Sedang Dipinjam** | Pinjaman aktif beserta jatuh tempo dan tanda terlambat | **Konfirmasi Pengembalian** |
| **Denda** | Denda berstatus Tertunggak | **Tandai Lunas** setelah menerima pembayaran |
| **Riwayat** | Pinjaman Selesai/Ditolak | Hanya lihat |

**Alur kerja harian yang disarankan**

1. **Setujui/Tolak antrean.** Saat menyetujui, sistem mengunci baris buku, memastikan stok masih ada, mengurangi stok, mengisi tanggal pinjam dan jatuh tempo. Jika stok sudah habis atau Mahasiswa punya denda tertunggak, persetujuan ditolak dengan pesan. Aksi ganda dari halaman lama tidak diproses dua kali.
2. **Proses pengembalian.** Pegawai menerima buku fisik lalu menekan konfirmasi: status menjadi Selesai, stok bertambah, dan bila terlambat denda dihitung serta berstatus Tertunggak.
3. **Catat pelunasan.** Setelah Mahasiswa membayar, Pegawai menandai denda Lunas sehingga Mahasiswa dapat meminjam lagi.
4. **Putuskan perpanjangan.** Setujui bila wajar; jatuh tempo otomatis bertambah.

#### 3.4 Manajemen Buku (`/pegawai/books`)

- **Tambah buku**: isi judul (unik, tanpa membedakan huruf besar/kecil), ISBN (unik), pengarang, penerbit, tahun terbit, kategori, stok, durasi maksimal pinjam (1-365 hari), denda per hari, tautan sampul, dan deskripsi. Stok tersedia awal = stok total.
- **Ubah buku**: data dan stok dapat diubah; stok diubah dalam transaksi agar konsisten dengan buku yang sedang dipinjam.
- **Hapus buku**: konfirmasi dahulu. Buku yang sudah punya riwayat peminjaman **tidak dapat dihapus** (dilindungi database) dan sistem menampilkan pesan.
- Pada request buku yang disetujui Admin, form tambah buku terisi otomatis dari data request.

#### 3.5 Pengumuman (`/pegawai/announcements`)

Buat, ubah, hapus pengumuman dengan kategori **Operasional / Layanan / Acara** dan status **Draft** (tidak tampil publik, ada pratinjau) atau **Published** (tampil di beranda dan `/pengumuman`).

#### 3.6 Profil dan katalog

Pegawai dapat melihat katalog lewat **Lihat Katalog** (di sana tombol Dashboard berwarna merah untuk kembali, dan ada **← Kembali ke Beranda**). Profil: ubah data, password, dan foto seperti Mahasiswa. Nomor identitas (NIP) tidak diubah sendiri.

### 4. Admin

Admin adalah akun tunggal pengelola sistem. **Admin tidak memakai halaman publik**: jika membuka `/`, `/katalog`, `/buku/...`, atau `/pengumuman`, sistem langsung mengalihkan ke `/admin`. Karena itu menu "Katalog" tidak tersedia untuk Admin.

#### 4.1 Menu sidebar Admin

- **Utama**: Dashboard
- **Data Master**: User · Kategori · Request Buku · Transaksi
- **Operasional**: Peminjaman · Buku · Pengumuman (halaman yang sama dengan Pegawai, sehingga Admin dapat menggantikan Pegawai)
- **Akun**: Profil Saya

#### 4.2 Manajemen User (`/admin/users`)

| Aksi | Aturan |
|---|---|
| Lihat & filter | Filter berdasarkan peran; daftar memuat nama, email, peran, nomor identitas |
| Tambah user | Peran yang dapat dipilih hanya **Pegawai** dan **Mahasiswa**. **Admin tidak bisa dibuat** (akun Admin hanya satu) |
| Edit user | Ubah nama, email, peran (Pegawai/Mahasiswa), nomor identitas, dan password baru (opsional). Akun Admin **tidak dapat diedit** dan tidak ada tombol Edit untuknya |
| Mahasiswa menjadi Pegawai | Hanya boleh bila Mahasiswa itu **bebas dari pinjaman aktif/menunggu dan bebas denda tertunggak**; jika tidak, perubahan ditolak dengan pesan |
| Hapus user | Akun Admin tidak dapat dihapus, dan Admin tidak dapat menghapus dirinya. **Mahasiswa dengan riwayat transaksi tetap bisa dihapus bila sudah tidak punya pinjaman aktif/menunggu dan tidak ada denda tertunggak**; riwayatnya ikut dibersihkan dalam satu transaksi. Jika belum bebas, muncul pesan alasannya |

Pesan sukses/gagal tampil sebentar lalu **hilang otomatis**.

#### 4.3 Manajemen Kategori (`/admin/categories`)

Tambah, ubah, hapus kategori buku (nama dan kode unik). Kategori yang masih dipakai buku tidak dapat dihapus.

#### 4.4 Request Buku (`/admin/requests`)

Daftar request dari Mahasiswa dengan filter status. Admin memilih **Setujui** atau **Tolak** (catatan wajib saat menolak). Request yang disetujui dapat langsung diteruskan ke form **Tambah Buku** dengan data terisi otomatis.

#### 4.5 Monitoring Transaksi (`/admin/transactions`)

Seluruh peminjaman dengan pencarian, filter status, dan paginasi, hanya untuk dipantau.

#### 4.6 Dashboard Admin

Statistik sistem (jumlah user per peran, buku, peminjaman aktif, denda) dan transaksi terbaru.

#### 4.7 Profil Admin

Admin dapat mengganti foto dan password. Data identitas Admin bersifat tetap; Admin tidak menampilkan keterangan tambahan pada form profilnya.

## Aturan Bisnis (Ringkasan)

| Aturan | Nilai |
|---|---|
| Pinjaman aktif per buku per Mahasiswa | 1 |
| Durasi pinjam | Sesuai kolom **durasi maksimal pinjam** tiap buku |
| Perpanjangan | Maks **2 kali**, hanya **sebelum jatuh tempo**, tiap kali menambah durasi buku |
| Denda | Hari terlambat x tarif per hari buku; dikunci saat pengembalian |
| Denda tertunggak | Memblokir pengajuan dan persetujuan pinjam baru |
| Request buku | Hanya Mahasiswa; maks 3 berstatus Menunggu; ditinjau Admin |
| Ulasan | Hanya setelah pinjaman Selesai; satu per buku per Mahasiswa; rating 1-5 |
| Akun Admin | Tunggal; tidak dapat dibuat, diedit, atau dihapus lewat Manajemen User |
| Hapus Mahasiswa | Boleh bila tidak ada pinjaman aktif dan tidak ada denda tertunggak |
| Mahasiswa menjadi Pegawai | Boleh bila bebas pinjaman aktif dan bebas denda |

## Alur Status

```text
Peminjaman:
  Menunggu Konfirmasi --(Pegawai setujui)--> Sedang Dipinjam --(Pegawai konfirmasi kembali)--> Selesai
          |                                        |  ^
          +--(Pegawai tolak + alasan)--> Ditolak   |  +-- perpanjangan (maks 2x) disetujui: jatuh tempo bertambah
                                                   +-- Perpanjangan Diajukan --(setujui/tolak)

Denda (dihitung saat pengembalian):
  Tidak Ada            (tepat waktu)
  Tertunggak --(Pegawai tandai lunas)--> Lunas

Request buku:
  Menunggu --(Admin)--> Disetujui | Ditolak        (Mahasiswa boleh membatalkan selama Menunggu)

Pengumuman:
  Draft <--> Published
```

## Fitur Umum

- **Tema gelap/terang**: tombol matahari/bulan di navbar dan sidebar; pilihan tersimpan di browser dan diterapkan sebelum halaman tampil (tanpa berkedip).
- **Navbar publik**: bila sudah login, tombol di kanan menjadi dropdown **Profil** (isinya Dashboard dan Keluar). Guest melihat tombol Masuk/Daftar.
- **Sidebar dashboard** untuk Admin, Pegawai, dan Mahasiswa, responsif di layar kecil.
- **Transisi halaman**: tirai merah-hitam saat berpindah halaman.
- **Pesan notifikasi** hilang otomatis dan tidak muncul lagi setelah refresh.
- **Foto profil** disimpan di database dan ditampilkan lewat `/api/foto/[id]` (hanya JPG/PNG/WebP, maks 2 MB).

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
