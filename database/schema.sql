DROP VIEW  IF EXISTS v_loans_denda;
DROP TABLE IF EXISTS book_requests CASCADE;
DROP TABLE IF EXISTS reviews       CASCADE;
DROP TABLE IF EXISTS loans         CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS books         CASCADE;
DROP TABLE IF EXISTS categories    CASCADE;
DROP TABLE IF EXISTS users         CASCADE;

CREATE TABLE users (
    id               SERIAL PRIMARY KEY,
    nama             VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    password_hash    VARCHAR(100) NOT NULL,
    role             VARCHAR(20)  NOT NULL
                     CHECK (role IN ('admin', 'pegawai', 'mahasiswa')),
    nomor_identitas  VARCHAR(30)  NOT NULL UNIQUE,
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    foto_data        BYTEA,
    foto_tipe        VARCHAR(20),
    foto_diubah      TIMESTAMP,
    CONSTRAINT chk_foto_lengkap CHECK ((foto_data IS NULL) = (foto_tipe IS NULL))
);

CREATE TABLE categories (
    id         SERIAL PRIMARY KEY,
    nama       VARCHAR(100) NOT NULL UNIQUE,
    kode       VARCHAR(20)  NOT NULL UNIQUE,
    deskripsi  TEXT
);

CREATE TABLE books (
    id                  SERIAL PRIMARY KEY,
    judul               VARCHAR(200) NOT NULL,
    isbn                VARCHAR(20)  NOT NULL UNIQUE,
    pengarang           VARCHAR(150) NOT NULL,
    penerbit            VARCHAR(150) NOT NULL,
    tahun_terbit        INTEGER      NOT NULL CHECK (tahun_terbit BETWEEN 1000 AND 2100),
    category_id         INTEGER      NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    stok_total          INTEGER      NOT NULL CHECK (stok_total >= 0),
    stok_tersedia       INTEGER      NOT NULL CHECK (stok_tersedia >= 0),
    durasi_maks_pinjam  INTEGER      NOT NULL DEFAULT 7 CHECK (durasi_maks_pinjam > 0),
    denda_per_hari      INTEGER      NOT NULL DEFAULT 1000 CHECK (denda_per_hari >= 0),
    cover_url           TEXT,
    deskripsi           TEXT,
    created_at          TIMESTAMP    NOT NULL DEFAULT NOW(),
    CHECK (stok_tersedia <= stok_total)
);
CREATE INDEX idx_books_category ON books(category_id);

CREATE TABLE announcements (
    id             SERIAL PRIMARY KEY,
    judul          VARCHAR(200) NOT NULL,
    konten         TEXT         NOT NULL,
    kategori       VARCHAR(20)  NOT NULL
                   CHECK (kategori IN ('Operasional', 'Layanan', 'Acara')),
    tanggal_rilis  DATE         NOT NULL DEFAULT CURRENT_DATE,
    status         VARCHAR(20)  NOT NULL DEFAULT 'Draft'
                   CHECK (status IN ('Draft', 'Published')),
    author_id      INTEGER      REFERENCES users(id) ON DELETE SET NULL,
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE loans (
    id                   SERIAL PRIMARY KEY,
    user_id              INTEGER     NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    book_id              INTEGER     NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    status               VARCHAR(30) NOT NULL DEFAULT 'Menunggu Konfirmasi'
                         CHECK (status IN ('Menunggu Konfirmasi', 'Sedang Dipinjam',
                                           'Ditolak', 'Selesai')),
    alasan_penolakan     TEXT,
    tanggal_pengajuan    TIMESTAMP   NOT NULL DEFAULT NOW(),
    tanggal_pinjam       DATE,
    tanggal_jatuh_tempo  DATE,
    tanggal_kembali      DATE,
    status_perpanjangan  VARCHAR(30) NOT NULL DEFAULT 'Tidak Ada'
                         CHECK (status_perpanjangan IN ('Tidak Ada', 'Perpanjangan Diajukan',
                                                        'Perpanjangan Disetujui',
                                                        'Perpanjangan Ditolak')),
    jumlah_perpanjangan  INTEGER     NOT NULL DEFAULT 0 CHECK (jumlah_perpanjangan >= 0),
    denda_nominal        INTEGER     NOT NULL DEFAULT 0 CHECK (denda_nominal >= 0),
    status_denda         VARCHAR(20) NOT NULL DEFAULT 'Tidak Ada'
                         CHECK (status_denda IN ('Tidak Ada', 'Tertunggak', 'Lunas')),
    approved_by          INTEGER     REFERENCES users(id) ON DELETE SET NULL,
    returned_by          INTEGER     REFERENCES users(id) ON DELETE SET NULL,
    created_at           TIMESTAMP   NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_loans_user   ON loans(user_id);
CREATE INDEX idx_loans_book   ON loans(book_id);
CREATE INDEX idx_loans_status ON loans(status);

CREATE UNIQUE INDEX uq_loan_aktif
    ON loans (user_id, book_id)
    WHERE status IN ('Menunggu Konfirmasi', 'Sedang Dipinjam');

CREATE TABLE reviews (
    id          SERIAL PRIMARY KEY,
    loan_id     INTEGER   NOT NULL UNIQUE REFERENCES loans(id) ON DELETE CASCADE,
    user_id     INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id     INTEGER   NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    rating      INTEGER   NOT NULL CHECK (rating BETWEEN 1 AND 5),
    komentar    TEXT      NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, book_id)
);
CREATE INDEX idx_reviews_book ON reviews(book_id);

CREATE TABLE book_requests (
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
CREATE INDEX idx_book_requests_user   ON book_requests(user_id);
CREATE INDEX idx_book_requests_status ON book_requests(status);

CREATE UNIQUE INDEX uq_request_menunggu ON book_requests (user_id, lower(judul)) WHERE status = 'Menunggu';

CREATE VIEW v_loans_denda AS
SELECT
    l.id AS loan_id,
    l.user_id,
    l.book_id,
    l.status,
    l.tanggal_jatuh_tempo,
    l.tanggal_kembali,
    l.status_denda,
    l.denda_nominal,
    b.denda_per_hari,
    CASE
        WHEN l.status IN ('Sedang Dipinjam', 'Selesai') AND l.tanggal_jatuh_tempo IS NOT NULL
        THEN GREATEST(0, COALESCE(l.tanggal_kembali, CURRENT_DATE) - l.tanggal_jatuh_tempo)
        ELSE 0
    END AS hari_terlambat,
    CASE
        WHEN l.status IN ('Sedang Dipinjam', 'Selesai') AND l.tanggal_jatuh_tempo IS NOT NULL
        THEN GREATEST(0, COALESCE(l.tanggal_kembali, CURRENT_DATE) - l.tanggal_jatuh_tempo)
             * b.denda_per_hari
        ELSE 0
    END AS denda_hitung
FROM loans l
JOIN books b ON b.id = l.book_id;
