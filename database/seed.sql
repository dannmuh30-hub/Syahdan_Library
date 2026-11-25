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
 ('Sastra & Bahasa',     'SB-800', 'Novel, puisi, linguistik, dan kajian bahasa'),
 ('Misteri & Thriller',  'MT-813', 'Novel misteri, detektif, dan thriller psikologis'),
 ('Romansa',             'RM-813', 'Novel romansa dan komedi romantis'),
 ('Psikologi & Memoar',  'PM-150', 'Psikologi populer, kesehatan jiwa, dan memoar'),
 ('Pengembangan Diri',   'PD-158', 'Pengembangan diri dan keterampilan hidup'),
 ('Fiksi Ilmiah',        'FI-813', 'Fiksi ilmiah dan fantasi');

INSERT INTO books (judul, isbn, pengarang, penerbit, tahun_terbit, category_id,
                   stok_total, stok_tersedia, durasi_maks_pinjam, denda_per_hari, cover_url) VALUES
 ('Pemrograman Web dengan Next.js',    '978-602-0000-001', 'Andi Wijaya',       'Informatika',       2023, 1, 5, 4,  7, 1000, NULL),
 ('Basis Data: Konsep dan PostgreSQL', '978-602-0000-002', 'Rina Wulandari',    'Andi Offset',       2021, 1, 4, 3,  7, 1000, NULL),
 ('Rekayasa Perangkat Lunak',          '978-602-0000-003', 'Roger Pressman',    'Erlangga',          2019, 1, 3, 3, 14, 1500, NULL),
 ('Pengantar Hukum Indonesia',         '978-602-0000-004', 'Sudikno M.',        'Liberty',           2018, 2, 3, 3, 14, 1000, NULL),
 ('Hukum Tata Negara',                 '978-602-0000-005', 'Jimly Asshiddiqie', 'Rajawali Pers',     2020, 2, 2, 2, 14, 1000, NULL),
 ('Anatomi Dasar Manusia',             '978-602-0000-006', 'Dewi Kartika',      'EGC',               2022, 3, 4, 4,  7, 2000, NULL),
 ('Laskar Pelangi',                    '978-602-0000-007', 'Andrea Hirata',     'Bentang',           2005, 4, 6, 6, 14,  500, NULL),
 ('Bumi Manusia',                      '978-602-0000-008', 'Pramoedya A. T.',   'Lentera Dipantara', 2006, 4, 5, 5, 14,  500, NULL);

INSERT INTO books (judul, isbn, pengarang, penerbit, tahun_terbit, category_id,
                   stok_total, stok_tersedia, durasi_maks_pinjam, denda_per_hari, deskripsi)
SELECT v.judul, v.isbn, v.pengarang, v.penerbit, v.tahun, c.id, 3, 3, 14, 1000, v.deskripsi
  FROM (VALUES
 ('Laut Bercerita', '978-602-1000-001', 'Leila S. Chudori', 'KPG', 2017, 'Sastra & Bahasa', 'Kisah persahabatan dan penculikan aktivis mahasiswa 1998 serta duka keluarga yang ditinggalkan.'),
 ('Cantik Itu Luka', '978-602-1000-002', 'Eka Kurniawan', 'Gramedia Pustaka Utama', 2002, 'Sastra & Bahasa', 'Epik keluarga berlatar masa kolonial hingga kemerdekaan yang berawal dari bangkitnya Dewi Ayu dari kubur.'),
 ('Sisi Tergelap Surga', '978-602-1000-003', 'Brian Khrisna', 'Gramedia Pustaka Utama', 2023, 'Sastra & Bahasa', 'Potret realitas keras warga pinggiran Jakarta melalui sudut pandang 18 karakter yang berjuang bertahan hidup.'),
 ('Yellowface', '978-602-1000-004', 'R.F. Kuang', 'Gramedia Pustaka Utama', 2023, 'Sastra & Bahasa', 'Satir tajam tentang obsesi ketenaran dan pencurian naskah di balik industri penerbitan modern.'),
 ('Teka-Teki Gambar Aneh', '978-602-1000-005', 'Uketsu', 'Gramedia Pustaka Utama', 2026, 'Misteri & Thriller', 'Penelusuran detektif amatir memecahkan kasus pembunuhan lewat kejanggalan pada ilustrasi sederhana.'),
 ('Dear Debbie', '978-602-1000-006', 'Freida McFadden', 'Poisoned Pen Press', 2026, 'Misteri & Thriller', 'Kisah kolumnis nasihat rumah tangga yang membalas dendam setelah hidup dan keluarganya dikhianati.'),
 ('My Husband''s Wife', '978-602-1000-007', 'Alice Feeney', 'Flatiron Books', 2026, 'Misteri & Thriller', 'Seorang seniman pulang ke rumah dan mendapati wanita asing membukakan pintu serta mengaku sebagai istrinya.'),
 ('Keajaiban Toko Kelontong Namiya', '978-602-1000-008', 'Keigo Higashino', 'Gramedia Pustaka Utama', 2012, 'Misteri & Thriller', 'Tiga pemuda bersembunyi di toko kelontong tua dan menerima surat permintaan saran yang terhubung lintas waktu.'),
 ('The Let Them Theory', '978-602-1000-009', 'Mel Robbins', 'Hay House', 2024, 'Pengembangan Diri', 'Panduan praktis melepaskan kendali atas perilaku orang lain demi menjaga ketenangan dan fokus diri.'),
 ('Seorang Pria yang Melalui Duka dengan Mencuci Piring', '978-602-1000-010', 'dr. Andreas Kurniawan, Sp.KJ', 'Gramedia Pustaka Utama', 2023, 'Psikologi & Memoar', 'Refleksi seorang psikiater dalam memaknai kehilangan besar dan kedukaan lewat aktivitas sehari-hari.'),
 ('I Want to Die but I Want to Eat Tteokbokki', '978-602-1000-011', 'Baek Se-hee', 'Penerbit Haru', 2018, 'Psikologi & Memoar', 'Catatan percakapan jujur penulis bersama psikiaternya selama 12 minggu mengenai distimia dan keraguan diri.'),
 ('Strangers: A Memoir of Marriage', '978-602-1000-012', 'Belle Burden', 'Random House', 2026, 'Psikologi & Memoar', 'Kisah nyata pemulihan diri seorang perempuan setelah pernikahan panjangnya berakhir mendadak akibat pengkhianatan.'),
 ('Half His Age', '978-602-1000-013', 'Jennette McCurdy', 'Ballantine Books', 2026, 'Sastra & Bahasa', 'Novel tentang relasi timpang, pencarian validasi, dan dinamika kekuasaan dari sudut pandang remaja di Alaska.'),
 ('Project Hail Mary', '978-602-1000-014', 'Andy Weir', 'Ballantine Books', 2021, 'Fiksi Ilmiah', 'Seorang astronaut terbangun tanpa ingatan di luar angkasa dan memakai sains untuk menyelamatkan Bumi.'),
 ('Funiculi Funicula', '978-602-1000-015', 'Toshikazu Kawaguchi', 'Gramedia Pustaka Utama', 2015, 'Sastra & Bahasa', 'Kisah empat pengunjung kafe tua di Tokyo yang bisa kembali ke masa lalu sebelum kopi yang disajikan dingin.'),
 ('Dunia Sophie', '978-602-1000-016', 'Jostein Gaarder', 'Mizan', 1991, 'Sastra & Bahasa', 'Pengantar sejarah filsafat Barat melalui misteri surat-surat filosofis yang diterima gadis berusia 14 tahun.'),
 ('The Calamity Club', '978-602-1000-017', 'Kathryn Stockett', 'Penguin Press', 2026, 'Sastra & Bahasa', 'Kisah solidaritas sekelompok perempuan tangguh dan seorang gadis yatim piatu di Mississippi tahun 1933.'),
 ('Our Perfect Storm', '978-602-1000-018', 'Carley Fortune', 'Berkley', 2026, 'Romansa', 'Dua sahabat lama menjalani perjalanan bulan madu yang batal di Vancouver dan menghadapi perasaan terpendam.'),
 ('The Night We Met', '978-602-1000-019', 'Abby Jimenez', 'Forever', 2026, 'Romansa', 'Kisah pilihan hidup dan persahabatan setelah satu keputusan sepulang konser mengubah arah hubungan mereka.'),
 ('Whistler', '978-602-1000-020', 'Ann Patchett', 'Harper', 2026, 'Sastra & Bahasa', 'Pertemuan tak terduga di museum seni mempertemukan kembali seorang perempuan dengan mantan ayah tirinya')
  ) AS v(judul, isbn, pengarang, penerbit, tahun, kategori, deskripsi)
  JOIN categories c ON c.nama = v.kategori;

UPDATE books b
   SET cover_url = v.url
  FROM (VALUES
 ('Laut Bercerita', 'https://i.pinimg.com/736x/9a/bb/61/9abb61fcf68afd124375a82dfd02ca6a.jpg'),
 ('Teka-Teki Gambar Aneh', 'https://i.pinimg.com/736x/65/7e/ff/657eff68573143bbffab44c67b22cca6.jpg'),
 ('Anatomi Dasar Manusia', 'https://i.pinimg.com/736x/3b/76/2f/3b762fcc9888c6892cb2b7f89f580174.jpg'),
 ('Funiculi Funicula', 'https://i.pinimg.com/736x/5b/6a/33/5b6a33dfd82dab6495972320edfab32c.jpg'),
 ('Half His Age', 'https://i.pinimg.com/736x/8e/8a/f8/8e8af8817abca7c6c072f978caa4e664.jpg'),
 ('Hukum Tata Negara', 'https://i.pinimg.com/1200x/39/13/ae/3913ae64b4f9c31165645622e7e45f7b.jpg'),
 ('Keajaiban Toko Kelontong Namiya', 'https://i.pinimg.com/736x/06/2d/49/062d499a6fb73216a0e9ecd2586802eb.jpg'),
 ('Laskar Pelangi', 'https://i.pinimg.com/736x/10/dc/06/10dc06814790d2159ade8a25ac61fa24.jpg'),
 ('My Husband''s Wife', 'https://i.pinimg.com/736x/b9/b4/1a/b9b41a8f45326279fd65a6e3edd07bb8.jpg'),
 ('Our Perfect Storm', 'https://i.pinimg.com/1200x/a4/5f/b5/a45fb53e1413ae3720b1acd2d71feead.jpg'),
 ('Pemrograman Web dengan Next.js', 'https://i.pinimg.com/736x/79/fe/f5/79fef5c6a030eeeeab34bba35e06eb48.jpg'),
 ('Pengantar Hukum Indonesia', 'https://i.pinimg.com/736x/0e/b5/4d/0eb54d8413ba97bf255183dd8dbdeb83.jpg'),
 ('Project Hail Mary', 'https://i.pinimg.com/736x/fd/f4/53/fdf4538a04bacaad6eeee3183f236322.jpg'),
 ('Seorang Pria yang Melalui Duka dengan Mencuci Piring', 'https://i.pinimg.com/736x/d8/0e/d9/d80ed93811bddff1d7b0e108ac725d40.jpg'),
 ('Rekayasa Perangkat Lunak', 'https://ebooks.gramedia.com/ebook-covers/70301/image_highres/BLK_RPL202239782.jpg'),
 ('Sisi Tergelap Surga', 'https://i.pinimg.com/736x/59/99/69/599969d075895875c16576361a30f16b.jpg'),
 ('Strangers: A Memoir of Marriage', 'https://i.pinimg.com/1200x/48/e2/8e/48e28e71bd25f59fb3859dc657cafd2e.jpg'),
 ('The Calamity Club', 'https://i.pinimg.com/236x/87/90/6f/87906f112016a50c91baf2ddc3dd0343.jpg'),
 ('The Let Them Theory', 'https://i.pinimg.com/736x/04/9a/2f/049a2f09429f1b75a2a8651c59887eba.jpg'),
 ('The Night We Met', 'https://i.pinimg.com/1200x/d7/74/20/d77420927f2ca89fd9b22ebee02f648a.jpg'),
 ('Whistler', 'https://i.pinimg.com/236x/12/6b/b6/126bb67d906a126493d1350b18fdcf36.jpg'),
 ('Yellowface', 'https://i.pinimg.com/1200x/b1/40/03/b140032e77ee3cbc20dbd03ac567b0ac.jpg'),
 ('I Want to Die but I Want to Eat Tteokbokki', 'https://cdn.gramedia.com/uploads/products/xtbt5ziitw.jpg'),
 ('Basis Data: Konsep dan PostgreSQL', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCqcmFz-ERg-3SAUbJmkMF5YVwEITwhZhckaePlDiV3plKqn7k0qr_MoU&s=10'),
 ('Bumi Manusia', 'https://i.pinimg.com/1200x/6c/17/a4/6c17a4b5b319770f4cb180d6bc0ab54f.jpg'),
 ('Cantik Itu Luka', 'https://i.pinimg.com/736x/0c/82/83/0c828372aed61a93e91e51d25e3cf99e.jpg'),
 ('Dear Debbie', 'https://i.pinimg.com/736x/29/87/b9/2987b9bc0f6e78d65630905b694c0b75.jpg'),
 ('Dunia Sophie', 'https://i.pinimg.com/1200x/a0/81/4b/a0814b7e021a0d3c46de19dc2993efee.jpg')
  ) AS v(judul, url)
 WHERE lower(b.judul) = lower(v.judul);

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

INSERT INTO book_requests (user_id, judul, pengarang, penerbit, tahun_terbit, alasan, status, catatan_admin, reviewed_by, reviewed_at) VALUES
 (3, 'Atomic Habits', 'James Clear', 'Gramedia Pustaka Utama', 2019, 'Banyak dibutuhkan teman satu angkatan untuk membangun kebiasaan belajar.', 'Menunggu', NULL, NULL, NULL),
 (4, 'Filosofi Teras', 'Henry Manampiring', 'Buku Kompas', 2018, 'Pengantar filsafat Stoa yang mudah dipahami mahasiswa.', 'Ditolak', 'Judul sedang dalam proses pengadaan; coba ajukan kembali bulan depan.', 1, NOW());

