ALTER TABLE books ADD COLUMN IF NOT EXISTS deskripsi TEXT;

CREATE TABLE IF NOT EXISTS book_requests (
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER      NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    judul          VARCHAR(200) NOT NULL,
    pengarang      VARCHAR(150) NOT NULL,
    penerbit       VARCHAR(150),
    tahun_terbit   INTEGER      CHECK (tahun_terbit BETWEEN 1000 AND 2100),
    alasan         TEXT,
    status         VARCHAR(20)  NOT NULL DEFAULT 'Menunggu'
                   CHECK (status IN ('Menunggu', 'Disetujui', 'Ditolak', 'Ditambahkan')),
    catatan_admin  TEXT,
    reviewed_by    INTEGER      REFERENCES users(id) ON DELETE SET NULL,
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    reviewed_at    TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_book_requests_user   ON book_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_book_requests_status ON book_requests(status);
CREATE UNIQUE INDEX IF NOT EXISTS uq_request_menunggu ON book_requests (user_id, lower(judul)) WHERE status = 'Menunggu';

INSERT INTO categories (nama, kode, deskripsi) VALUES
 ('Misteri & Thriller',          'MT-813', 'Novel misteri, detektif, dan thriller psikologis'),
 ('Romansa',                     'RM-813', 'Novel romansa dan komedi romantis'),
 ('Psikologi & Memoar',          'PM-150', 'Psikologi populer, kesehatan jiwa, dan memoar'),
 ('Pengembangan Diri',           'PD-158', 'Pengembangan diri dan keterampilan hidup'),
 ('Fiksi Ilmiah',                'FI-813', 'Fiksi ilmiah dan fantasi')
ON CONFLICT DO NOTHING;

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
  JOIN categories c ON c.nama = v.kategori
 WHERE NOT EXISTS (SELECT 1 FROM books b WHERE lower(b.judul) = lower(v.judul))
ON CONFLICT (isbn) DO NOTHING;
