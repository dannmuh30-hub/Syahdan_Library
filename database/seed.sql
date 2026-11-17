CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (nama, email, password_hash, role, nomor_identitas) VALUES
 ('Administrator Perpustakaan', 'admin@perpus.ac.id',        crypt('admin123',     gen_salt('bf', 10)), 'admin',     'ADM-0001'),
 ('Pegawai Sirkulasi',          'pegawai@perpus.ac.id',      crypt('pegawai123',   gen_salt('bf', 10)), 'pegawai',   'PGW-0001'),
 ('Andi Pratama',               'andi@student.unhas.ac.id',  crypt('mahasiswa123', gen_salt('bf', 10)), 'mahasiswa', 'H071231001'),
 ('Siti Aisyah',                'siti@student.unhas.ac.id',  crypt('mahasiswa123', gen_salt('bf', 10)), 'mahasiswa', 'H071231002'),
 ('Rudi Hartono',               'rudi@student.unhas.ac.id',  crypt('mahasiswa123', gen_salt('bf', 10)), 'mahasiswa', 'H071231003');

INSERT INTO categories (nama, kode, deskripsi) VALUES
 ('Teknologi Informasi', 'TI-004', 'Pemrograman, basis data, jaringan, dan sistem informasi'),
 ('Hukum',               'HK-340', 'Ilmu hukum, perundang-undangan, dan tata negara'),
 ('Kedokteran',          'KD-610', 'Ilmu kedokteran dan kesehatan'),
 ('Sastra & Bahasa',     'SB-800', 'Novel, puisi, linguistik, dan kajian bahasa');

INSERT INTO books (judul, isbn, pengarang, penerbit, tahun_terbit, category_id,
                   stok_total, stok_tersedia, durasi_maks_pinjam, denda_per_hari, cover_url) VALUES
 ('Pemrograman Web dengan Next.js',    '978-602-0000-001', 'Andi Wijaya',      'Informatika',       2023, 1, 5, 4,  7, 1000, NULL),
 ('Basis Data: Konsep dan PostgreSQL', '978-602-0000-002', 'Rina Wulandari',   'Andi Offset',       2021, 1, 4, 3,  7, 1000, NULL),
 ('Rekayasa Perangkat Lunak',          '978-602-0000-003', 'Roger Pressman',   'Erlangga',          2019, 1, 3, 3, 14, 1500, NULL),
 ('Pengantar Hukum Indonesia',         '978-602-0000-004', 'Sudikno M.',       'Liberty',           2018, 2, 3, 3, 14, 1000, NULL),
 ('Hukum Tata Negara',                 '978-602-0000-005', 'Jimly Asshiddiqie','Rajawali Pers',     2020, 2, 2, 2, 14, 1000, NULL),
 ('Anatomi Dasar Manusia',             '978-602-0000-006', 'Dewi Kartika',     'EGC',               2022, 3, 4, 4,  7, 2000, NULL),
 ('Laskar Pelangi',                    '978-602-0000-007', 'Andrea Hirata',    'Bentang',           2005, 4, 6, 6, 14,  500, NULL),
 ('Bumi Manusia',                      '978-602-0000-008', 'Pramoedya A. T.',  'Lentera Dipantara', 2006, 4, 5, 5, 14,  500, NULL);

INSERT INTO announcements (judul, konten, kategori, tanggal_rilis, status, author_id) VALUES
 ('Jadwal Layanan Selama Libur Akhir Tahun',
  'Perpustakaan tutup pada 24 Desember 2026 sampai 1 Januari 2027. Layanan normal kembali 4 Januari 2027.',
  'Operasional', CURRENT_DATE, 'Published', 2),
 ('Pengadaan Buku Baru Semester Genap',
  'Perpustakaan menambah 120 judul buku baru bidang teknologi informasi dan hukum.',
  'Layanan', CURRENT_DATE - 2, 'Published', 2),
 ('Workshop Literasi Informasi',
  'Workshop pencarian referensi ilmiah terbuka untuk seluruh mahasiswa. Pendaftaran di meja sirkulasi.',
  'Acara', CURRENT_DATE - 5, 'Published', 2),
 ('Draft: Perubahan Jam Layanan Hari Jumat',
  'Rencana perubahan jam layanan hari Jumat. Belum final.',
  'Operasional', CURRENT_DATE, 'Draft', 2);

INSERT INTO loans (user_id, book_id, status, alasan_penolakan, tanggal_pengajuan,
                   tanggal_pinjam, tanggal_jatuh_tempo, tanggal_kembali,
                   status_perpanjangan, jumlah_perpanjangan, denda_nominal, status_denda,
                   approved_by, returned_by) VALUES
 (3, 3, 'Menunggu Konfirmasi', NULL, NOW() - INTERVAL '1 hour',
  NULL, NULL, NULL, 'Tidak Ada', 0, 0, 'Tidak Ada', NULL, NULL),
 (3, 1, 'Sedang Dipinjam', NULL, NOW() - INTERVAL '2 days',
  CURRENT_DATE - 2, CURRENT_DATE + 5, NULL, 'Tidak Ada', 0, 0, 'Tidak Ada', 2, NULL),
 (4, 2, 'Sedang Dipinjam', NULL, NOW() - INTERVAL '10 days',
  CURRENT_DATE - 10, CURRENT_DATE - 3, NULL, 'Tidak Ada', 0, 0, 'Tidak Ada', 2, NULL),
 (4, 7, 'Selesai', NULL, NOW() - INTERVAL '20 days',
  CURRENT_DATE - 20, CURRENT_DATE - 6, CURRENT_DATE - 8, 'Tidak Ada', 0, 0, 'Tidak Ada', 2, 2),
 (5, 1, 'Selesai', NULL, NOW() - INTERVAL '25 days',
  CURRENT_DATE - 25, CURRENT_DATE - 18, CURRENT_DATE - 14, 'Tidak Ada', 0, 4000, 'Tertunggak', 2, 2),
 (3, 8, 'Selesai', NULL, NOW() - INTERVAL '30 days',
  CURRENT_DATE - 30, CURRENT_DATE - 16, CURRENT_DATE - 14, 'Perpanjangan Disetujui', 1, 1000, 'Lunas', 2, 2),
 (4, 6, 'Ditolak', 'Buku sedang dalam proses inventarisasi.', NOW() - INTERVAL '4 days',
  NULL, NULL, NULL, 'Tidak Ada', 0, 0, 'Tidak Ada', 2, NULL),
 (3, 4, 'Selesai', NULL, NOW() - INTERVAL '40 days',
  CURRENT_DATE - 40, CURRENT_DATE - 26, CURRENT_DATE - 30, 'Tidak Ada', 0, 0, 'Tidak Ada', 2, 2);

INSERT INTO reviews (loan_id, user_id, book_id, rating, komentar) VALUES
 (4, 4, 7, 5, 'Cerita yang menginspirasi, sangat layak dibaca semua mahasiswa.'),
 (6, 3, 8, 4, 'Bahasanya berat tetapi isinya sangat berbobot.'),
 (8, 3, 4, 4, 'Pengantar yang jelas untuk pemula di bidang hukum.');
