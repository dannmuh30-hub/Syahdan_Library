# 📚 Manajemen Perpustakaan

**Sistem perpustakaan kampus berbasis web: telusuri koleksi, ajukan pinjam, kelola denda, dan pantau seluruh transaksi dengan hak akses per peran.**

[📋 Fitur](#-fitur) · [🚀 Instalasi](#-instalasi) · [📖 Penggunaan](#-penggunaan) · [🤝 Kontribusi](#-kontribusi)

---

## 📋 Daftar Isi

- [🎯 Tentang Proyek](#-tentang-proyek)
- [✨ Fitur](#-fitur)
- [🧰 Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [💻 Persyaratan Sistem](#-persyaratan-sistem)
- [🚀 Instalasi](#-instalasi)
- [🔧 Konfigurasi](#-konfigurasi)
- [📁 Struktur Proyek](#-struktur-proyek)
- [📖 Penggunaan](#-penggunaan)
- [📚 Dokumentasi](#-dokumentasi)
- [🧪 Pengujian](#-pengujian)
- [🆘 Masalah Umum](#-masalah-umum)
- [🤝 Kontribusi](#-kontribusi)
- [👤 Kontak](#-kontak)

---

## 🎯 Tentang Proyek

**Manajemen Perpustakaan** adalah aplikasi web untuk mengelola perpustakaan kampus. Mahasiswa dapat menelusuri katalog, meminjam, memperpanjang, dan memberi ulasan; Pegawai memproses peminjaman, pengembalian, dan denda; Admin mengatur pengguna, kategori, dan usulan buku.

Aplikasi memiliki empat peran (**Guest, Mahasiswa, Pegawai, Admin**) dengan hak akses yang selalu dicek di server. Proyek ini adalah **Tugas Final Praktikum Pemrograman Web 2026 (Individual Project 5)**.

### 🎯 Tujuan
- 📖 Memudahkan mahasiswa menemukan buku dan melihat ketersediaannya tanpa datang langsung
- 🔄 Membuat proses pinjam, perpanjang, kembali, dan denda tertib dan terdokumentasi
- 🗂️ Memberi pengelola gambaran menyeluruh atas koleksi, pengguna, dan transaksi
- 🗣️ Memberi mahasiswa jalur resmi untuk mengusulkan buku baru dan memberi ulasan

### ⭐ Nilai Inti
- ✅ **Otorisasi di Server** - Setiap halaman dan setiap aksi memeriksa ulang peran pengguna, bukan sekadar menyembunyikan tombol
- ✅ **Stok Selalu Konsisten** - Persetujuan pinjam memakai transaksi SQL dengan row lock, sehingga stok terakhir tidak bisa direbut dua kali
- ✅ **Denda Otomatis** - Dihitung di database dari hari terlambat dikali tarif per hari buku
- ✅ **Aturan Bisnis Tegas** - Perpanjangan dibatasi, denda tertunggak memblokir pinjaman baru, akun Admin dilindungi
- ✅ **Tema Gelap dan Terang** - Pilihan tersimpan di browser dan diterapkan tanpa berkedip
- ✅ **Responsif** - Dirancang untuk desktop dan mobile, dengan sidebar dashboard per peran

---

## ✨ Fitur

### 🌐 Katalog dan Beranda (publik)
- 🏠 **Beranda** - Pencarian cepat, slider *Buku Terpopuler* (tombol **Lihat Semua** ke katalog), pengumuman terbaru, dan footer
- 🔎 **Katalog** - Pencarian judul, filter kategori, dan urutan (judul, tahun terbit, rating) yang langsung diterapkan; tombol **Reset** mengembalikan semuanya; tombol **← Kembali ke Beranda**
- 📘 **Detail Buku** - Sampul, data buku, deskripsi, stok, rating rata-rata, dan ulasan
- 📢 **Pengumuman** - Daftar dan detail pengumuman berstatus Published

### 🎓 Mahasiswa
- 📝 **Registrasi** dengan validasi: nama tanpa angka, email kampus `.ac.id` (hanya huruf dan angka sebelum `@`), NIM unik, password 8-72 karakter
- 📥 **Ajukan Pinjam** - Diblokir bila stok habis, ada denda tertunggak, atau buku yang sama masih aktif dipinjam
- 🔁 **Perpanjangan** - Maksimal 2 kali, hanya sebelum jatuh tempo, persetujuan Pegawai
- 💸 **Pantau Denda** - Status Tertunggak atau Lunas langsung terlihat di dashboard
- ⭐ **Rating dan Ulasan** - Setelah pinjaman Selesai, satu ulasan per buku
- 📬 **Request Buku** - Usulkan buku baru (maksimal 3 menunggu) dan pantau keputusan Admin

### 🧑‍💼 Pegawai
- 📋 **Meja Peminjaman** - Tab Antrean, Perpanjangan, Sedang Dipinjam, Denda, dan Riwayat
- ✅ **Setujui atau Tolak** pinjaman (penolakan wajib beralasan)
- 📦 **Konfirmasi Pengembalian** dan **Tandai Lunas** denda
- 📚 **Manajemen Buku** - Tambah, ubah, dan hapus buku; judul dan ISBN ganda ditolak
- 📢 **Manajemen Pengumuman** - Kategori Operasional, Layanan, Acara; status Draft atau Published

### 🛡️ Admin
- 👥 **Manajemen User** - Tambah Pegawai atau Mahasiswa, ubah data, hapus dengan aturan perlindungan; akun Admin tunggal dan tidak bisa dibuat, diedit, atau dihapus
- 🏷️ **Manajemen Kategori**
- 📬 **Request Buku** - Setujui atau tolak usulan Mahasiswa, lalu teruskan ke form Tambah Buku yang terisi otomatis
- 🧾 **Monitoring Transaksi** - Pencarian, filter status, dan paginasi
- 🧰 Menu operasional yang sama dengan Pegawai (peminjaman, buku, pengumuman)
- 🚫 Tidak memakai halaman publik: membuka katalog atau beranda otomatis dialihkan ke dashboard

### 👤 Profil dan Tampilan (semua pengguna yang login)
- 🖼️ **Foto Profil** - JPG, PNG, atau WebP maksimal 2 MB, disimpan di database
- 🔐 **Ubah Password** - Dengan ikon mata untuk melihat atau menyembunyikan isian
- 🌗 **Mode Terang/Gelap** - Tombol di navbar dan sidebar
- 🧭 **Dropdown Profil** - Berisi Dashboard dan Keluar
- 🎬 **Transisi Halaman** - Tirai merah-hitam saat berpindah halaman
- 🔔 **Notifikasi** yang hilang sendiri dan tidak muncul lagi setelah refresh

---

## 🧰 Teknologi yang Digunakan

### 🔧 Backend
- **Next.js 16** (App Router, Server Actions, Route Handlers) - Framework fullstack
- **Node.js 20+** - Runtime JavaScript
- **PostgreSQL** - Sistem manajemen database
- **pg (node-postgres)** - Driver dengan Raw SQL berparameter (tanpa ORM)

### 🎨 Frontend
- **React 19** - Library antarmuka (JSX)
- **Tailwind CSS 4** - Styling dengan palet tema gelap bawaan dan tema terang lewat CSS variables

### 🔐 Keamanan
- **bcryptjs** - Hash password
- **Cookie sesi httpOnly** - Ditandatangani HMAC, sehingga peran tidak dapat dipalsukan dari browser

---

## 💻 Persyaratan Sistem

- **Node.js** 20 atau lebih baru
- **NPM** 10 atau lebih baru
- **PostgreSQL** 14 atau lebih baru

Cek versi dengan `node -v` dan `psql --version`.

---

## 🚀 Instalasi

### 1️⃣ Clone Repository

```bash
git clone <url-repository-ini>
cd manajemen-perpustakaan
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Buat Database

```bash
psql -U postgres -c "CREATE DATABASE perpustakaan;"
```

Atau lewat pgAdmin: klik kanan *Databases* → *Create* → *Database*, dengan nama `perpustakaan`.

### 4️⃣ Setup Environment

```bash
# Mac / Linux
cp .env.example .env.local

# Windows (CMD)
copy .env.example .env.local
```

> File berawalan titik tersembunyi di Finder (Mac: **Cmd + Shift + .**) dan File Explorer (Windows: *View → Hidden items*).

### 5️⃣ Konfigurasi Environment

Edit `.env.local`:

```env
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/perpustakaan
SESSION_SECRET=teks-acak-minimal-32-karakter
```

Jika password memuat karakter khusus, tulis dalam bentuk URL (`@` menjadi `%40`, `#` menjadi `%23`, `/` menjadi `%2F`). Contoh membuat `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6️⃣ Siapkan Tabel dan Data

```bash
# Database kosong: buat tabel, lalu isi data contoh
psql -U postgres -d perpustakaan -f database/schema.sql
psql -U postgres -d perpustakaan -f database/seed.sql
```

> ⚠️ `schema.sql` **menghapus tabel lama** sebelum membuatnya kembali. Jalankan hanya di awal.

Pilihan lain untuk database lama yang sudah berisi data (tanpa menghapusnya):
- `database/migrasi_hari9.sql` - Menambah kolom deskripsi, tabel request buku, kategori baru, dan 20 buku (aman diulang)
- `database/migrasi_foto_profil.sql` - Menambah kolom foto profil di tabel `users`
- `database/sampul_buku.sql` - Memasang tautan sampul buku (aman diulang)

### 7️⃣ Jalankan Server

```bash
# Pengembangan
npm run dev

# Produksi
npm run build
npm start
```

🌐 Akses aplikasi di: `http://localhost:3000` · Cek koneksi database di `http://localhost:3000/api/health`

---

## 🔧 Konfigurasi

### 🔑 Kredensial Demo

Tersedia setelah menjalankan `seed.sql`:

| Peran | Email | Password |
|---|---|---|
| 👨‍💼 Admin | `admin@perpus.ac.id` | `admin123` |
| 🧑‍💼 Pegawai | `pegawai@perpus.ac.id` | `pegawai123` |
| 🎓 Mahasiswa | `andi@student.unhas.ac.id` | `mahasiswa123` |
| 🎓 Mahasiswa | `siti@student.unhas.ac.id` | `mahasiswa123` |
| 🎓 Mahasiswa (denda tertunggak, pinjam diblokir) | `rudi@student.unhas.ac.id` | `mahasiswa123` |

> 🔒 Untuk produksi, ganti seluruh password demo.

### Environment Variables

| Variabel | Fungsi |
|---|---|
| `DATABASE_URL` | Alamat koneksi PostgreSQL |
| `SESSION_SECRET` | Rahasia penanda tangan cookie sesi (minimal 32 karakter acak) |

### Perintah npm

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan |
| `npm run build` / `npm start` | Build dan jalankan produksi |
| `npm run lint` | Pemeriksaan kode dengan ESLint |

---

## 📁 Struktur Proyek

### 📂 Direktori Utama

**`src/app/`** - Halaman, server actions, dan route API

**`src/components/`** - Komponen UI bersama (shell dashboard, form, kartu buku, filter katalog)

**`src/lib/`** - Koneksi database, sesi, autentikasi, aturan bisnis, dan validasi

**`database/`** - Skema SQL, data contoh, dan skrip migrasi (di luar folder app, sesuai aturan tugas)

```
manajemen-perpustakaan/
├── database/
│   ├── schema.sql                 # skema PostgreSQL + view denda
│   ├── seed.sql                   # data contoh (akun demo, 28 buku)
│   ├── migrasi_hari9.sql
│   ├── migrasi_foto_profil.sql
│   └── sampul_buku.sql
├── src/
│   ├── proxy.js                   # proteksi route per peran
│   ├── app/
│   │   ├── actions/               # server actions
│   │   │   ├── auth.js  admin.js  books.js  announcements.js
│   │   │   └── loans.js  reviews.js  requests.js  profile.js
│   │   ├── api/
│   │   │   ├── health/            # uji koneksi database
│   │   │   └── foto/[id]/         # penyaji foto profil
│   │   ├── login/  register/
│   │   ├── katalog/  buku/[id]/  pengumuman/
│   │   ├── profil/
│   │   ├── mahasiswa/             # dashboard, loans/, requests/
│   │   ├── pegawai/               # dashboard, loans/, books/, announcements/
│   │   ├── admin/                 # dashboard, users/, categories/, requests/, transactions/
│   │   ├── globals.css            # tema gelap/terang dan transisi
│   │   ├── layout.js
│   │   ├── template.js            # transisi halaman
│   │   └── page.js                # Beranda
│   ├── components/                # BookCard, CatalogFilters, ProfileForms, ShellFrame, ...
│   └── lib/
│       ├── db.js                  # Pool pg + helper transaksi
│       ├── token.js  session.js   # tanda tangan dan cookie sesi
│       ├── auth.js                # getCurrentUser, requireRole
│       ├── rules.js               # aturan bisnis (maks perpanjangan)
│       ├── nav.js                 # menu sidebar per peran
│       └── validation.js          # validasi form di server
├── .env.example
├── PROGRESS.md                    # catatan progres harian
├── package.json
└── README.md
```

### 📄 File Penting

- **`database/schema.sql`** - Definisi seluruh tabel dan view `v_loans_denda`
- **`src/proxy.js`** - Penjaga akses per peran sebelum halaman dirender
- **`src/app/actions/loans.js`** - Seluruh alur pinjam, perpanjang, kembali, dan denda
- **`src/lib/validation.js`** - Aturan validasi form
- **`.env.example`** - Template environment

---

## 📖 Penggunaan

### 🌐 Untuk Guest
1. 🏠 Membuka **Beranda** (selalu menjadi halaman pertama)
2. 🔎 Menelusuri buku lewat pencarian, slider populer, atau **Lihat Semua** ke katalog
3. 🎛️ Memilih kategori atau urutan di katalog (langsung diterapkan), **Reset** untuk mengembalikan, **← Kembali ke Beranda** untuk pulang
4. 📘 Membuka detail buku untuk membaca deskripsi dan ulasan
5. 🔐 Menekan **Pinjam** atau membuka halaman terlindungi akan diarahkan ke **Login**

### 🎓 Untuk Mahasiswa

**Mendaftar dan masuk**
1. 📝 Buka `/register`, isi nama (tanpa angka), email kampus `.ac.id` (huruf dan angka saja), NIM, dan password
2. 🔐 Login di `/login`, lalu masuk ke Dashboard Mahasiswa

**Meminjam buku**
1. 🔎 Buka Katalog, pilih buku, tekan **Ajukan Pinjam**
2. ⏳ Status menjadi **Menunggu Konfirmasi** (stok belum berkurang)
3. ✅ Pegawai menyetujui: status **Sedang Dipinjam**, jatuh tempo terisi. Bila **Ditolak**, alasan ditampilkan dan boleh diajukan lagi
4. 📦 Kembalikan buku ke Pegawai: status **Selesai**

**Memperpanjang**
1. 🔁 Di **Peminjaman Saya**, tekan **Ajukan Perpanjangan** (belum lewat jatuh tempo, maksimal 2 kali)
2. 👍 Bila disetujui, jatuh tempo bertambah sebesar durasi maksimal pinjam buku itu

**Denda**
1. ⚠️ Terlambat mengembalikan: denda = hari terlambat x tarif per hari, dikunci saat pengembalian
2. 🚫 Selama denda **Tertunggak**, pinjaman baru diblokir
3. 💵 Bayar di meja Pegawai; setelah ditandai **Lunas**, akses pinjam terbuka kembali

**Ulasan dan request buku**
1. ⭐ Setelah pinjaman Selesai, beri rating 1-5 dan ulasan (satu per buku)
2. 📬 Di **Request Buku**, usulkan buku baru dan pantau keputusan Admin

**Profil**
1. 👤 Ubah nama dan email, ganti password, unggah atau hapus foto lewat menu **Profil**

### 🧑‍💼 Untuk Pegawai
1. 🏠 **Dashboard** - Kartu Antrean, Perpanjangan, Sedang dipinjam, Terlambat, Denda tertunggak, Stok habis
2. 📋 **Peminjaman → Antrean** - Setujui, atau Tolak dengan alasan
3. 🔁 **Perpanjangan** - Setujui atau tolak pengajuan
4. 📦 **Sedang Dipinjam** - Konfirmasi pengembalian (stok bertambah, denda dihitung bila terlambat)
5. 💵 **Denda** - Tandai Lunas setelah pembayaran diterima
6. 📚 **Buku** - Tambah, ubah, dan hapus buku (buku dengan riwayat pinjam tidak bisa dihapus)
7. 📢 **Pengumuman** - Buat dan kelola; Draft tidak tampil publik

### 👨‍💼 Untuk Admin
1. 👥 **User** - Tambah, ubah, dan hapus akun Pegawai atau Mahasiswa
2. 🏷️ **Kategori** - Kelola kategori buku
3. 📬 **Request Buku** - Setujui atau tolak usulan, lalu teruskan ke form Tambah Buku
4. 🧾 **Transaksi** - Pantau seluruh peminjaman
5. 🧰 **Operasional** - Peminjaman, Buku, dan Pengumuman seperti Pegawai

### 🛡️ Ringkasan Otoritas

| Peran | Akses |
|---|---|
| **Guest** | Beranda, katalog, detail buku, pengumuman (lihat saja), Login/Daftar |
| **Mahasiswa** | + Dashboard, Peminjaman Saya, Request Buku, Profil; pinjam, perpanjang, ulasan |
| **Pegawai** | + Meja Peminjaman, Manajemen Buku (tambah/ubah/hapus), Pengumuman, Profil |
| **Admin** | Dashboard, User, Kategori, Request Buku, Transaksi, menu Operasional, Profil; tidak dapat membuka halaman publik |

> Akun Admin hanya satu (dari `seed.sql`); tidak bisa dibuat lewat pendaftaran maupun Manajemen User.

### 📏 Aturan Penting

| Aturan | Nilai |
|---|---|
| Pinjaman aktif per buku per Mahasiswa | 1 |
| Durasi pinjam | Sesuai `durasi_maks_pinjam` tiap buku |
| Perpanjangan | Maksimal 2 kali, hanya sebelum jatuh tempo |
| Denda | Hari terlambat x `denda_per_hari`, dikunci saat pengembalian |
| Denda tertunggak | Memblokir pengajuan dan persetujuan pinjaman baru |
| Mahasiswa menjadi Pegawai | Hanya bila bebas pinjaman aktif dan bebas denda |
| Hapus Mahasiswa | Hanya bila tidak ada pinjaman aktif dan tidak ada denda tertunggak |
| Request buku | Hanya Mahasiswa, maksimal 3 berstatus Menunggu |

### 🔀 Alur Status

```
Peminjaman:
  Menunggu Konfirmasi ──setujui──▶ Sedang Dipinjam ──kembali──▶ Selesai
          │                              ▲
          └──tolak + alasan──▶ Ditolak   └── perpanjangan disetujui (maks 2x)

Denda:    Tidak Ada (tepat waktu)  |  Tertunggak ──tandai lunas──▶ Lunas
Request:  Menunggu ──Admin──▶ Disetujui | Ditolak
Pengumuman: Draft ◀──▶ Published
```

---

## 📚 Dokumentasi

### 🗄️ Skema Database

| Tabel | Isi |
|---|---|
| `users` | Akun, peran, nomor identitas (NIM/NIP), foto profil |
| `categories` | Kategori buku |
| `books` | Buku: stok, durasi maksimal pinjam, tarif denda, sampul, deskripsi |
| `announcements` | Pengumuman (Draft/Published, kategori) |
| `loans` | Peminjaman, perpanjangan, dan status denda |
| `reviews` | Rating 1-5 dan ulasan |
| `book_requests` | Usulan buku dari Mahasiswa dan keputusan Admin |
| `v_loans_denda` (view) | Perhitungan keterlambatan dan denda saat runtime |

Aturan yang ditegakkan di level database:
- Email, NIM, ISBN, serta nama dan kode kategori bersifat unik
- Stok tersedia tidak boleh negatif dan tidak boleh melebihi stok total
- Satu Mahasiswa tidak dapat punya dua pengajuan atau peminjaman aktif untuk buku yang sama
- Rating dibatasi 1 sampai 5, satu ulasan per Mahasiswa per buku
- Buku dan pengguna yang punya transaksi tidak dapat dihapus langsung (`ON DELETE RESTRICT`)

### 🖼️ Penyimpanan Gambar

- **Sampul buku**: tautan gambar di kolom `books.cover_url`, diisi lewat form buku
- **Foto profil**: disimpan sebagai data biner di database, disajikan lewat `/api/foto/[id]`; tipe file ditentukan dari isi berkas (bukan nama berkas) dan dibatasi 2 MB

### 🔐 Catatan Keamanan

- Query selalu berparameter (`$1`, `$2`, ...) untuk mencegah SQL injection
- Cookie sesi httpOnly dan ditandatangani; peran dicek ulang ke database pada setiap halaman terlindungi
- Setiap server action memeriksa ulang peran dan kepemilikan data
- Perubahan status memakai `UPDATE` bersyarat atau transaksi dengan row lock, sehingga aksi ganda dari halaman basi tidak diproses dua kali
- Pesan hasil aksi dipetakan dari kode tetap, bukan dari teks di URL
- Parameter pencarian di-escape; parameter urutan dan filter memakai whitelist
- File `.env.local` tidak boleh di-commit (sudah ada di `.gitignore`)

### 🔌 Ringkasan Endpoint

| Endpoint | Fungsi |
|---|---|
| `GET /api/health` | Uji koneksi database |
| `GET /api/foto/[id]` | Menyajikan foto profil pengguna |

Operasi data lainnya (pinjam, setujui, kembali, perpanjang, kelola buku dan user, profil) berjalan lewat **server actions** di `src/app/actions/`, bukan endpoint REST.

---

## 🧪 Pengujian

Pemeriksaan yang tersedia:

```bash
# Memeriksa gaya dan kesalahan kode
npm run lint

# Memastikan seluruh halaman dapat dibangun tanpa error
npm run build
```

### ✅ Daftar Periksa Manual

- ✅ Login dan logout untuk setiap peran; Guest diarahkan ke `/login` pada halaman terlindungi
- ✅ Admin yang membuka `/`, `/katalog`, `/buku/...`, atau `/pengumuman` dialihkan ke `/admin`
- ✅ Registrasi: nama berangka ditolak, email berkarakter selain huruf/angka ditolak
- ✅ Katalog: pencarian, filter, urutan langsung diterapkan; Reset; tombol Kembali ke Beranda
- ✅ Alur lengkap: ajukan, setujui/tolak, kembali, denda, lunas, perpanjang, ulasan
- ✅ Mahasiswa dengan denda tertunggak tidak dapat meminjam
- ✅ Pegawai menambah dan menghapus buku; Admin mengelola user sesuai aturan
- ✅ Profil: ganti foto, ganti password, mode terang/gelap
- ✅ Tampilan responsif pada lebar 375 px

---

## 🆘 Masalah Umum

| Pesan | Penyebab dan solusi |
|---|---|
| `password authentication failed` | Password di `DATABASE_URL` salah |
| `ECONNREFUSED` | PostgreSQL belum berjalan, atau port berbeda |
| `database "..." does not exist` | Database belum dibuat, nama di URL berbeda, atau `.env.local` tidak terbaca (pastikan satu folder dengan `package.json`) |
| `Cannot find module 'pg'` | Jalankan `npm install` |
| Halaman error pada fitur foto profil | Database lama belum punya kolom foto: jalankan `database/migrasi_foto_profil.sql` |
| `function crypt(...) does not exist` | Ekstensi `pgcrypto` belum aktif: jalankan `CREATE EXTENSION IF NOT EXISTS pgcrypto;` lalu ulangi `seed.sql` |
| Perubahan tidak tampil setelah edit `.env.local` | Hentikan server lalu jalankan ulang `npm run dev` |

> 💡 Jika nama database di pesan error sama dengan nama user komputer Anda, hampir pasti `.env.local` belum terbaca.

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Untuk berkontribusi:

1. 🍴 **Fork** repository
2. 🌿 **Buat** feature branch (`git checkout -b feature/FiturBaru`)
3. 💾 **Commit** perubahan Anda (`git commit -m 'Tambah FiturBaru'`)
4. 📤 **Push** ke branch (`git push origin feature/FiturBaru`)
5. 🔄 **Buka** Pull Request

> ⚠️ Jangan pernah meng-commit file `.env.local`. File itu sudah tercantum di `.gitignore`.

---

## 👤 Kontak

**Muhammad Syahdan** - Mahasiswa Sistem Informasi, Universitas Hasanuddin

📌 Repository: `<https://github.com/dannmuh30-hub/Syahdan_Library>` 

---

⭐ Jika Anda menyukai repository ini, berikan bintang ya!
