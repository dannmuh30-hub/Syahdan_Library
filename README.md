# 📚 Manajemen Perpustakaan

### Sistem perpustakaan kampus berbasis web untuk mengelola koleksi buku, pengumuman, dan peminjaman dengan hak akses per peran.

[📋 Fitur](#-fitur) · [🚀 Instalasi](#-instalasi) · [🤝 Kontribusi](#-kontribusi)

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

**Manajemen Perpustakaan** adalah aplikasi web untuk perpustakaan kampus. Pengunjung dapat menelusuri katalog buku dan membaca pengumuman. Mahasiswa dapat meminjam buku, memperpanjang masa pinjam, memberi ulasan, dan mengusulkan buku baru. Pegawai memproses seluruh transaksi peminjaman, sedangkan Admin mengelola pengguna, kategori, dan usulan buku.

Proyek ini adalah **Tugas Final Praktikum Pemrograman Web 2026 (Individual Project 5)**. Aplikasi memiliki empat peran (guest, mahasiswa, pegawai, admin) dengan otorisasi yang selalu dicek di server.

### 🎯 Tujuan

- 📖 Memudahkan mahasiswa menemukan dan meminjam buku tanpa antre manual
- 🧾 Membantu pegawai memproses peminjaman, pengembalian, perpanjangan, dan denda dalam satu meja kerja
- 🛠️ Memberi admin kendali atas data master dan pemantauan seluruh transaksi
- 💬 Mengumpulkan ulasan dan usulan buku dari mahasiswa agar koleksi terus berkembang

### ⭐ Nilai Inti

- ✅ **Hak Akses per Peran** - Route dilindungi sebelum halaman dirender, dan setiap server action memeriksa ulang peran serta kepemilikan data
- ✅ **Stok Konsisten** - Perubahan stok dilakukan dalam transaksi SQL dengan row lock, sehingga dua persetujuan untuk stok terakhir tidak bisa lolos bersamaan
- ✅ **Denda Otomatis** - Keterlambatan dan denda dihitung lewat view database, lalu dikunci saat buku dikembalikan
- ✅ **Aturan di Level Database** - Keunikan, batas stok, batas rating, dan relasi dijaga lewat constraint, bukan hanya validasi form
- ✅ **Responsif** - Tampilan menyesuaikan desktop, tablet, dan mobile, dengan tema gelap dan terang

---

## ✨ Fitur

### 🌐 Halaman Publik (Guest)

- 🏠 **Beranda** - Pencarian cepat, slider *Buku Terpopuler*, dan pengumuman terbaru
- 🔎 **Katalog** - Pencarian, filter kategori, urutan (judul, tahun terbit, rating), dan paginasi
- 📘 **Detail Buku** - Sampul, data buku, deskripsi, stok, rating rata-rata, dan daftar ulasan
- 📢 **Pengumuman** - Daftar dan detail pengumuman berstatus *Published*

### 🎓 Mahasiswa

- 📝 **Pendaftaran Mandiri** - Wajib email kampus berakhiran `.ac.id`, NIM unik, dan password 8-72 karakter
- 📚 **Peminjaman** - Ajukan pinjam, pantau status, dan lihat riwayat
- 🔁 **Perpanjangan** - Maksimal 2 kali per pinjaman, hanya sebelum jatuh tempo
- 💸 **Denda** - Lihat denda tertunggak; peminjaman baru diblokir sampai lunas
- ⭐ **Rating dan Ulasan** - Setelah pinjaman selesai, satu ulasan per buku
- 📬 **Request Buku Baru** - Maksimal 3 request berstatus *Menunggu* sekaligus
- 👤 **Profil** - Ubah nama, email, password, dan foto profil

### 🧑‍💼 Pegawai

- 🗂️ **Meja Peminjaman** - Lima tab: Antrean, Perpanjangan, Sedang Dipinjam, Denda, dan Riwayat
- ✅ **Setujui atau Tolak** - Pengajuan pinjam dan perpanjangan, penolakan wajib disertai alasan
- 📥 **Konfirmasi Pengembalian** - Stok bertambah dan denda dihitung otomatis bila terlambat
- 💰 **Tandai Lunas** - Membuka kembali akses pinjam mahasiswa
- 📚 **Manajemen Buku** - Tambah, ubah, dan hapus buku (buku dengan riwayat peminjaman tidak dapat dihapus)
- 📢 **Manajemen Pengumuman** - Kategori *Operasional / Layanan / Acara*, status *Draft* atau *Published*

### 👨‍💼 Admin

- 👥 **Manajemen User** - Tambah, ubah, dan hapus akun Pegawai dan Mahasiswa; promosi Mahasiswa menjadi Pegawai
- 🏷️ **Manajemen Kategori** - Nama dan kode unik, kategori yang dipakai buku tidak dapat dihapus
- 📬 **Request Buku** - Setujui atau tolak usulan mahasiswa, lalu teruskan ke form Tambah Buku dengan data terisi otomatis
- 🧾 **Monitoring Transaksi** - Seluruh peminjaman dengan pencarian, filter status, dan paginasi
- 📊 **Dashboard** - Statistik pengguna, buku, peminjaman aktif, denda, dan transaksi terbaru
- 🔧 **Menu Operasional** - Peminjaman, Buku, dan Pengumuman, sehingga Admin dapat menggantikan Pegawai

### 🎨 UI/UX

- 🌗 **Tema Gelap dan Terang** - Pilihan tersimpan di browser dan diterapkan sebelum halaman tampil (tanpa berkedip)
- 🧭 **Sidebar Dashboard** - Untuk Admin, Pegawai, dan Mahasiswa, responsif di layar kecil
- 🎬 **Transisi Halaman** - Tirai merah-hitam saat berpindah halaman
- 🔔 **Pesan Notifikasi** - Hilang otomatis dan tidak muncul lagi setelah refresh

---

## 🧰 Teknologi yang Digunakan

### 🔧 Backend

- **Next.js 16** (App Router, Server Actions, Route Handlers) - Framework fullstack
- **Node.js** - Runtime JavaScript
- **PostgreSQL** - Sistem manajemen database
- **pg (node-postgres) 8** - Driver PostgreSQL, semua query memakai Raw SQL berparameter

### 🎨 Frontend

- **React 19** - Library antarmuka (JSX)
- **Tailwind CSS 4** - Styling utilitas, tema gelap bawaan dan tema terang tersedia

### 🔐 Keamanan

- **bcryptjs 3** - Hash password
- **Cookie sesi httpOnly** - Ditandatangani HMAC dengan `SESSION_SECRET`

---

## 💻 Persyaratan Sistem

- **Node.js** 20 atau lebih baru
- **npm**
- **PostgreSQL** (disarankan 14 atau lebih baru)
- **pgAdmin** (opsional, untuk menjalankan SQL lewat antarmuka grafis)

Cek versi dengan `node -v`, `npm -v`, dan `psql --version`.

---

## 🚀 Instalasi

### 1️⃣ Clone Repository

```bash
git clone https://github.com/dannmuh30-hub/Syahdan_Library.git
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

> Gunakan nama **`.env.local`**. File berawalan titik tersembunyi di Finder (Mac: **Cmd + Shift + .**) dan File Explorer (Windows: *View → Hidden items*).

### 5️⃣ Konfigurasi Environment

Edit `.env.local` dan sesuaikan:

```env
DATABASE_URL=postgresql://postgres:PASSWORD_ANDA@localhost:5432/perpustakaan
SESSION_SECRET=string-acak-minimal-32-karakter
```

Buat `SESSION_SECRET` acak dengan:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Jika password memuat karakter khusus, tulis dalam bentuk URL (`@` menjadi `%40`, `#` menjadi `%23`, `/` menjadi `%2F`).

### 6️⃣ Siapkan Tabel dan Data

Jalankan skema, lalu data demo:

```bash
psql -U postgres -d perpustakaan -f database/schema.sql
psql -U postgres -d perpustakaan -f database/seed.sql
```

Atau buka kedua file tersebut di **Query Tool** pgAdmin dan jalankan berurutan: `schema.sql` terlebih dahulu, baru `seed.sql`.

> ⚠️ `seed.sql` memakai ekstensi `pgcrypto` untuk meng-hash password akun demo. Ekstensi dibuat otomatis lewat `CREATE EXTENSION IF NOT EXISTS pgcrypto;`, jadi akun yang menjalankannya harus punya izin untuk itu (user `postgres` sudah cukup).

> ⚠️ Jalankan `seed.sql` hanya pada database yang baru dibuat. Menjalankannya berulang akan bentrok dengan data unik yang sudah ada.

### 7️⃣ Jalankan Server

```bash
# Pengembangan
npm run dev

# Produksi
npm run build
npm start
```

🌐 Akses aplikasi di: `http://localhost:3000`

Cek koneksi database di: `http://localhost:3000/api/health`

---

## 🔧 Konfigurasi

### 🔑 Kredensial Demo

Tersedia setelah menjalankan `database/seed.sql`:

| Peran | Email | Password |
|---|---|---|
| 👨‍💼 Admin | `admin@perpus.ac.id` | `admin321` |
| 🧑‍💼 Pegawai | `pegawai@perpus.ac.id` | `pegawai123` |
| 🎓 Mahasiswa | `andi@student.unhas.ac.id` | `mahasiswa123` |
| 🎓 Mahasiswa | `siti@student.unhas.ac.id` | `mahasiswa123` |
| 🎓 Mahasiswa (denda tertunggak, diblokir) | `rudi@student.unhas.ac.id` | `mahasiswa123` |

> 🔒 Akun hanya untuk demo. Password disimpan sebagai hash bcrypt. Untuk produksi, ganti seluruh password demo.

### Environment Variables

| Variabel | Fungsi |
|---|---|
| `DATABASE_URL` | Alamat koneksi PostgreSQL |
| `SESSION_SECRET` | Rahasia penanda tangan cookie sesi (minimal 32 karakter acak) |

### Perintah npm

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi |
| `npm start` | Menjalankan hasil build |
| `npm run lint` | Memeriksa kode dengan ESLint |

---

## 📁 Struktur Proyek

### 📂 Direktori Utama

**`src/app/`** - Halaman (server component), server actions, dan route API

**`src/components/`** - Komponen UI bersama (shell, form, kartu, slider, tema)

**`src/lib/`** - Koneksi database, autentikasi, sesi, validasi, dan aturan bisnis

**`database/`** - Skema SQL dan data demo (sengaja di luar folder `app`, sesuai aturan tugas)

**`public/`** - Aset statis

```text
manajemen-perpustakaan/
├── database/
│   ├── schema.sql                 # skema PostgreSQL (tabel, constraint, view)
│   └── seed.sql                   # data demo
├── public/
├── src/
│   ├── app/
│   │   ├── actions/               # server actions
│   │   │   ├── auth.js            # login, register, logout
│   │   │   ├── books.js           # CRUD buku
│   │   │   ├── loans.js           # pinjam, setujui, kembali, perpanjang, denda
│   │   │   ├── reviews.js         # ulasan
│   │   │   ├── requests.js        # request buku baru
│   │   │   ├── announcements.js   # CRUD pengumuman
│   │   │   ├── profile.js         # profil, password, foto
│   │   │   └── admin.js           # user dan kategori
│   │   ├── api/
│   │   │   ├── foto/[id]/         # menyajikan foto profil
│   │   │   └── health/            # uji koneksi database
│   │   ├── admin/                 # dashboard, users/, categories/, requests/, transactions/
│   │   ├── pegawai/               # dashboard, loans/, books/, announcements/
│   │   ├── mahasiswa/             # dashboard, loans/ (+ review), requests/
│   │   ├── katalog/               # katalog publik
│   │   ├── buku/[id]/             # detail buku
│   │   ├── pengumuman/            # daftar dan detail pengumuman
│   │   ├── profil/                # profil semua peran
│   │   ├── login/
│   │   ├── register/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── template.js            # transisi halaman
│   │   └── page.js                # beranda
│   ├── components/                # shell, form, kartu, slider, tema, dll.
│   ├── lib/
│   │   ├── db.js                  # koneksi PostgreSQL (Pool) dan helper transaksi
│   │   ├── token.js               # tanda tangan dan verifikasi token sesi
│   │   ├── session.js             # baca dan tulis cookie sesi
│   │   ├── auth.js                # getCurrentUser dan requireRole
│   │   ├── validation.js          # validasi form di sisi server
│   │   ├── rules.js               # aturan bisnis (batas perpanjangan)
│   │   ├── format.js              # format tanggal dan angka
│   │   └── nav.js                 # menu navigasi per peran
│   └── proxy.js                   # proteksi route per peran
├── .env.example
├── next.config.mjs
├── package.json
└── README.md
```

### 📄 File Penting

- `database/schema.sql` - Definisi seluruh tabel, constraint, dan view `v_loans_denda`
- `database/seed.sql` - Akun, kategori, buku, pengumuman, pinjaman, ulasan, dan request contoh
- `src/proxy.js` - Penjaga akses route sebelum halaman dirender
- `src/app/actions/loans.js` - Logika inti peminjaman, stok, dan denda
- `src/lib/validation.js` - Validasi seluruh form di server
- `.env.example` - Template environment

---

## 📖 Penggunaan

### 🌐 Untuk Guest

1. 🏠 Menjelajahi Beranda dan slider buku terpopuler
2. 🔎 Mencari buku di Katalog, memfilter kategori, dan mengurutkan hasil
3. 📘 Membaca detail buku, deskripsi, dan ulasan
4. 📢 Membaca pengumuman
5. 🔐 Menekan **Pinjam** atau membuka halaman yang butuh akun akan diarahkan ke `/login`

### 🎓 Untuk Mahasiswa

1. 📝 **Daftar** di `/register`, lalu login
2. 📚 **Ajukan Pinjam** dari halaman detail buku. Status awal *Menunggu Konfirmasi*, stok belum berkurang
3. ⏳ Pantau di **Peminjaman Saya**. Bila disetujui, status menjadi *Sedang Dipinjam* dan tanggal jatuh tempo terisi
4. 🔁 Ajukan **Perpanjangan** sebelum jatuh tempo (maksimal 2 kali)
5. 📥 Kembalikan buku ke Pegawai. Bila terlambat, denda berstatus *Tertunggak* dan harus dibayar di meja Pegawai
6. ⭐ Beri rating dan ulasan setelah pinjaman *Selesai*
7. 📬 Usulkan buku baru lewat **Request Buku**

Menu sidebar: Dashboard · Peminjaman Saya · Request Buku · Katalog · Pengumuman · Profil Saya

### 🧑‍💼 Untuk Pegawai

1. 📊 Buka **Dashboard** untuk melihat antrean, perpanjangan, keterlambatan, denda, dan stok habis
2. ✅ Di **Peminjaman**, setujui atau tolak antrean (penolakan wajib beralasan)
3. 📥 Konfirmasi pengembalian buku fisik pada tab *Sedang Dipinjam*
4. 💰 Tandai denda *Lunas* setelah menerima pembayaran
5. 📚 Kelola koleksi di **Buku** dan informasi di **Pengumuman**

Menu sidebar: Dashboard · Peminjaman · Buku · Pengumuman · Lihat Katalog · Profil Saya

### 👨‍💼 Untuk Admin

1. 👥 **Manajemen User** - Tambah akun Pegawai atau Mahasiswa, ubah data, promosikan Mahasiswa menjadi Pegawai, atau hapus akun
2. 🏷️ **Kategori** - Kelola kategori buku
3. 📬 **Request Buku** - Tinjau usulan, lalu teruskan yang disetujui ke form Tambah Buku
4. 🧾 **Transaksi** - Pantau seluruh peminjaman
5. 🔧 Gunakan menu **Operasional** (Peminjaman, Buku, Pengumuman) bila perlu menggantikan Pegawai

> Admin tidak memakai halaman publik. Membuka `/`, `/katalog`, `/buku/...`, atau `/pengumuman` otomatis dialihkan ke `/admin`.

### 🛡️ Ringkasan Otoritas

| Peran | Bisa | Tidak bisa |
|---|---|---|
| **Guest** | Melihat beranda, katalog, detail buku, ulasan, dan pengumuman | Meminjam, meminta buku, membuka dashboard |
| **Mahasiswa** | Meminjam, memperpanjang, mengulas, meminta buku baru, mengatur profil | Mengelola buku atau user |
| **Pegawai** | Memproses peminjaman, mengelola buku dan pengumuman, mengatur profil | Mengelola user, kategori, dan request buku |
| **Admin** | Mengelola user, kategori, dan request buku, memantau transaksi, plus menu operasional Pegawai | Melihat halaman publik, mengubah atau menghapus akun Admin |

> Akun Admin bersifat tunggal (bawaan seed). Admin tidak dapat dibuat lewat pendaftaran maupun Manajemen User.

---

## 📚 Dokumentasi

### 🗄️ Skema Database

| Tabel | Isi |
|---|---|
| `users` | Akun, peran, nomor identitas, foto profil |
| `categories` | Kategori buku (nama dan kode unik) |
| `books` | Data buku, stok total dan tersedia, durasi maksimal pinjam, denda per hari, tautan sampul |
| `announcements` | Pengumuman, kategori, tanggal rilis, dan status |
| `loans` | Peminjaman, status, perpanjangan, jatuh tempo, dan denda |
| `reviews` | Rating 1-5 dan komentar |
| `book_requests` | Usulan buku baru dari mahasiswa |
| `v_loans_denda` (view) | Perhitungan hari terlambat dan denda secara runtime |

Aturan penting yang ditegakkan di level database:

- Email, NIM, ISBN, serta nama dan kode kategori bersifat unik
- Stok tersedia tidak boleh negatif dan tidak boleh melebihi stok total
- Mahasiswa tidak dapat memiliki dua pengajuan atau peminjaman aktif untuk buku yang sama
- Rating dibatasi 1 sampai 5, satu ulasan per mahasiswa per buku
- Satu mahasiswa tidak dapat memiliki dua request berstatus *Menunggu* dengan judul yang sama
- Buku dan pengguna yang memiliki transaksi tidak dapat dihapus (`ON DELETE RESTRICT`)

### 📏 Aturan Bisnis

| Aturan | Nilai |
|---|---|
| Pinjaman aktif per buku per Mahasiswa | 1 |
| Durasi pinjam | Sesuai kolom durasi maksimal pinjam tiap buku |
| Perpanjangan | Maks **2 kali**, hanya sebelum jatuh tempo, tiap kali menambah durasi buku |
| Denda | Hari terlambat x tarif per hari buku, dikunci saat pengembalian |
| Denda tertunggak | Memblokir pengajuan dan persetujuan pinjam baru |
| Request buku | Hanya Mahasiswa, maks 3 berstatus Menunggu, ditinjau Admin |
| Ulasan | Hanya setelah pinjaman Selesai, satu per buku per Mahasiswa, rating 1-5 |
| Hapus Mahasiswa | Boleh bila tidak ada pinjaman aktif dan tidak ada denda tertunggak |
| Mahasiswa menjadi Pegawai | Boleh bila bebas pinjaman aktif dan bebas denda |

### 🔄 Alur Status

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

### 🔐 Proteksi Route

| Prefix | Peran yang diizinkan | Jika tidak diizinkan |
|---|---|---|
| `/admin` | Admin | Dialihkan ke dashboard peran masing-masing |
| `/pegawai` | Pegawai, Admin | Dialihkan ke dashboard peran masing-masing |
| `/mahasiswa` | Mahasiswa | Dialihkan ke dashboard peran masing-masing |
| `/`, `/katalog`, `/buku`, `/pengumuman` | Semua, kecuali Admin | Admin dialihkan ke `/admin` |

Pengunjung tanpa sesi yang membuka area terlindungi dialihkan ke `/login`.

### 🖼️ Foto Profil

Foto profil disimpan di database dan disajikan lewat `/api/foto/[id]`. Format yang diterima: JPG, PNG, dan WebP, maksimal 2 MB.

### 🛡️ Catatan Keamanan

- Query selalu memakai parameter (`$1`, `$2`, ...) untuk mencegah SQL injection
- Cookie sesi bersifat httpOnly dan ditandatangani; peran dicek ulang ke database pada setiap halaman terlindungi
- File `.env.local` tidak boleh di-commit (sudah diabaikan oleh `.gitignore`)
- Perubahan status memakai `UPDATE` bersyarat atau transaksi dengan row lock, sehingga aksi ganda dari halaman basi tidak diproses dua kali
- Pesan hasil aksi dipetakan dari kode tetap, bukan dari teks di URL
- Pola pencarian di-escape, dan parameter urutan serta filter memakai whitelist

---

## 🧪 Pengujian

Project ini belum memiliki test otomatis di dalam repository. Pemeriksaan yang tersedia:

```bash
# Memeriksa kode dengan ESLint
npm run lint

# Memastikan seluruh halaman dapat dibangun tanpa error
npm run build

# Memeriksa koneksi database (server harus berjalan)
# buka http://localhost:3000/api/health
```

### ✅ Daftar Periksa Manual

- ✅ Akses per peran: Guest, Mahasiswa, Pegawai, dan Admin ke setiap area, termasuk pengalihan ke `/login`
- ✅ Alur lengkap: ajukan, setujui atau tolak, pengembalian, denda, pelunasan, perpanjangan, dan ulasan
- ✅ Kasus tepi: stok terakhir diperebutkan dua persetujuan, aksi ganda dari halaman basi, data form dipalsukan (rating, id milik orang lain)
- ✅ Mahasiswa dengan denda tertunggak (`rudi@student.unhas.ac.id`) tidak dapat meminjam
- ✅ Tampilan responsif pada lebar 375 px untuk halaman utama semua peran

---

## 🆘 Masalah Umum

| Pesan | Penyebab dan solusi |
|---|---|
| `password authentication failed` | Password di `DATABASE_URL` salah |
| `ECONNREFUSED` | PostgreSQL belum berjalan, atau port berbeda |
| `database "..." does not exist` | Database belum dibuat, atau nama di URL berbeda |
| `permission denied to create extension "pgcrypto"` | Jalankan `seed.sql` dengan user yang punya izin (misalnya `postgres`) |
| `Cannot find module 'pg'` | Jalankan `npm install` |
| Selalu dialihkan ke `/login` setelah login | `SESSION_SECRET` kosong atau berubah; isi minimal 32 karakter lalu restart server |
| `Internal Server Error` di satu halaman | Lihat pesan error di terminal tempat `npm run dev` berjalan |

> 💡 Jika `.env.local` tidak terbaca, pastikan file berada di folder yang sama dengan `package.json`, lalu restart `npm run dev`.

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

GitHub: (https://github.com/dannmuh30-hub/Syahdan_Library)

