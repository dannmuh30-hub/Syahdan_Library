// Validasi sisi server untuk form autentikasi. Mengembalikan { values, errors }.

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData, key) {
  return String(formData.get(key) ?? "").trim();
}

// Email kampus: domain berakhiran .ac.id (contoh: andi@student.unhas.ac.id)
export function isCampusEmail(email) {
  return EMAIL_FORMAT.test(email) && email.toLowerCase().endsWith(".ac.id");
}

export function validateLogin(formData) {
  const values = { email: text(formData, "email").toLowerCase(), password: String(formData.get("password") ?? "") };
  const errors = {};
  if (!values.email) errors.email = "Email wajib diisi.";
  else if (!EMAIL_FORMAT.test(values.email)) errors.email = "Format email tidak valid.";
  if (!values.password) errors.password = "Password wajib diisi.";
  return { values, errors };
}

export function validateRegister(formData) {
  const values = {
    nama: text(formData, "nama"),
    email: text(formData, "email").toLowerCase(),
    nomor_identitas: text(formData, "nomor_identitas").toUpperCase(),
    password: String(formData.get("password") ?? ""),
    konfirmasi: String(formData.get("konfirmasi") ?? ""),
  };
  const errors = {};

  if (!values.nama) errors.nama = "Nama lengkap wajib diisi.";
  else if (values.nama.length < 3 || values.nama.length > 100) errors.nama = "Nama harus 3-100 karakter.";

  if (!values.email) errors.email = "Email wajib diisi.";
  else if (!EMAIL_FORMAT.test(values.email)) errors.email = "Format email tidak valid.";
  else if (!isCampusEmail(values.email)) errors.email = "Gunakan email kampus (berakhiran .ac.id).";

  if (!values.nomor_identitas) errors.nomor_identitas = "NIM wajib diisi.";
  else if (!/^[A-Z0-9]{5,20}$/.test(values.nomor_identitas)) errors.nomor_identitas = "NIM hanya huruf/angka, 5-20 karakter.";

  if (!values.password) errors.password = "Password wajib diisi.";
  else if (values.password.length < 8) errors.password = "Password minimal 8 karakter.";
  else if (values.password.length > 72) errors.password = "Password maksimal 72 karakter.";

  if (!values.konfirmasi) errors.konfirmasi = "Konfirmasi password wajib diisi.";
  else if (values.konfirmasi !== values.password) errors.konfirmasi = "Konfirmasi password tidak sama.";

  return { values, errors };
}

// ---------------------------------------------------------------------
// Hari 3: validasi form Admin (User dan Category)
// ---------------------------------------------------------------------
export const ROLES = ["admin", "pegawai", "mahasiswa"];
export const ROLE_LABEL = { admin: "Admin", pegawai: "Pegawai", mahasiswa: "Mahasiswa" };

// mode "create": semua field wajib, termasuk NIM dan password.
// mode "edit"  : nama, email, role, status aktif (NIM dan password tidak diubah di sini).
export function validateUserForm(formData, mode) {
  const values = {
    nama: text(formData, "nama"),
    email: text(formData, "email").toLowerCase(),
    role: text(formData, "role"),
    nomor_identitas: text(formData, "nomor_identitas").toUpperCase(),
    password: String(formData.get("password") ?? ""),
    is_active: formData.get("is_active") === "true",
  };
  const errors = {};

  if (!values.nama) errors.nama = "Nama lengkap wajib diisi.";
  else if (values.nama.length < 3 || values.nama.length > 100) errors.nama = "Nama harus 3-100 karakter.";

  if (!values.email) errors.email = "Email wajib diisi.";
  else if (!EMAIL_FORMAT.test(values.email)) errors.email = "Format email tidak valid.";
  else if (values.email.length > 150) errors.email = "Email maksimal 150 karakter.";

  if (!values.role) errors.role = "Role wajib dipilih.";
  else if (!ROLES.includes(values.role)) errors.role = "Role tidak valid.";

  if (mode === "create") {
    if (!values.nomor_identitas) errors.nomor_identitas = "Nomor identitas (NIM/NIP) wajib diisi.";
    else if (!/^[A-Z0-9-]{3,30}$/.test(values.nomor_identitas))
      errors.nomor_identitas = "Nomor identitas hanya huruf, angka, atau tanda hubung (3-30 karakter).";

    if (!values.password) errors.password = "Password wajib diisi.";
    else if (values.password.length < 8) errors.password = "Password minimal 8 karakter.";
    else if (values.password.length > 72) errors.password = "Password maksimal 72 karakter.";
  }
  return { values, errors };
}

export function validateCategoryForm(formData) {
  const values = {
    nama: text(formData, "nama"),
    kode: text(formData, "kode").toUpperCase(),
    deskripsi: text(formData, "deskripsi"),
  };
  const errors = {};

  if (!values.nama) errors.nama = "Nama kategori wajib diisi.";
  else if (values.nama.length < 2 || values.nama.length > 100) errors.nama = "Nama kategori harus 2-100 karakter.";

  if (!values.kode) errors.kode = "Kode klasifikasi wajib diisi.";
  else if (!/^[A-Z0-9.-]{2,20}$/.test(values.kode))
    errors.kode = "Kode hanya huruf, angka, titik, atau tanda hubung (2-20 karakter).";

  if (values.deskripsi.length > 500) errors.deskripsi = "Deskripsi maksimal 500 karakter.";

  return { values, errors };
}

// ID dari URL/form: kembalikan integer positif atau null.
export function parseId(value) {
  const s = String(value ?? "");
  if (!/^\d{1,9}$/.test(s)) return null;
  const n = Number(s);
  return n > 0 ? n : null;
}

// ---------------------------------------------------------------------
// Hari 4: validasi form Buku
// ---------------------------------------------------------------------
const INT = /^\d+$/;

// mode "create": ISBN wajib; mode "edit": ISBN tidak diubah (sesuai spesifikasi).
export function validateBookForm(formData, mode) {
  const values = {
    judul: text(formData, "judul"),
    isbn: text(formData, "isbn").toUpperCase(),
    pengarang: text(formData, "pengarang"),
    penerbit: text(formData, "penerbit"),
    tahun_terbit: text(formData, "tahun_terbit"),
    category_id: text(formData, "category_id"),
    stok_total: text(formData, "stok_total"),
    durasi_maks_pinjam: text(formData, "durasi_maks_pinjam"),
    denda_per_hari: text(formData, "denda_per_hari"),
    cover_url: text(formData, "cover_url"),
    deskripsi: text(formData, "deskripsi"),
  };
  const errors = {};
  const thisYear = new Date().getFullYear();

  if (!values.judul) errors.judul = "Judul buku wajib diisi.";
  else if (values.judul.length < 2 || values.judul.length > 200) errors.judul = "Judul harus 2-200 karakter.";

  if (mode === "create") {
    if (!values.isbn) errors.isbn = "ISBN wajib diisi.";
    else if (!/^[0-9X-]{10,20}$/.test(values.isbn)) errors.isbn = "ISBN hanya angka dan tanda hubung (10-20 karakter).";
  }

  if (!values.pengarang) errors.pengarang = "Pengarang wajib diisi.";
  else if (values.pengarang.length > 150) errors.pengarang = "Pengarang maksimal 150 karakter.";

  if (!values.penerbit) errors.penerbit = "Penerbit wajib diisi.";
  else if (values.penerbit.length > 150) errors.penerbit = "Penerbit maksimal 150 karakter.";

  if (!values.tahun_terbit) errors.tahun_terbit = "Tahun terbit wajib diisi.";
  else if (!INT.test(values.tahun_terbit) || Number(values.tahun_terbit) < 1000 || Number(values.tahun_terbit) > thisYear)
    errors.tahun_terbit = `Tahun terbit harus angka antara 1000 dan ${thisYear}.`;

  if (!values.category_id) errors.category_id = "Kategori wajib dipilih.";
  else if (!parseId(values.category_id)) errors.category_id = "Kategori tidak valid.";

  if (!values.stok_total) errors.stok_total = "Jumlah stok wajib diisi.";
  else if (!INT.test(values.stok_total) || Number(values.stok_total) > 100000)
    errors.stok_total = "Jumlah stok harus bilangan bulat 0 atau lebih (maksimal 100000).";

  if (!values.durasi_maks_pinjam) errors.durasi_maks_pinjam = "Durasi maksimal pinjam wajib diisi.";
  else if (!INT.test(values.durasi_maks_pinjam) || Number(values.durasi_maks_pinjam) < 1 || Number(values.durasi_maks_pinjam) > 365)
    errors.durasi_maks_pinjam = "Durasi harus 1-365 hari.";

  if (!values.denda_per_hari) errors.denda_per_hari = "Tarif denda per hari wajib diisi (isi 0 jika tanpa denda).";
  else if (!INT.test(values.denda_per_hari) || Number(values.denda_per_hari) > 1000000)
    errors.denda_per_hari = "Tarif denda harus bilangan bulat 0 atau lebih (maksimal 1.000.000).";

  if (values.deskripsi.length > 1000) errors.deskripsi = "Deskripsi maksimal 1000 karakter.";

  if (values.cover_url) {
    let okUrl = false;
    try {
      const u = new URL(values.cover_url);
      okUrl = u.protocol === "http:" || u.protocol === "https:";
    } catch {}
    if (!okUrl || values.cover_url.length > 500) errors.cover_url = "Tautan sampul harus URL http/https yang valid (maksimal 500 karakter).";
  }

  return { values, errors };
}

// ---------------------------------------------------------------------
// Hari 5: validasi form Pengumuman
// ---------------------------------------------------------------------
export const ANNOUNCEMENT_CATEGORIES = ["Operasional", "Layanan", "Acara"];
export const ANNOUNCEMENT_STATUSES = ["Draft", "Published"];

function isRealDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return y >= 2000 && y <= 2100 && dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function validateAnnouncementForm(formData) {
  const values = {
    judul: text(formData, "judul"),
    konten: String(formData.get("konten") ?? "").trim(),
    kategori: text(formData, "kategori"),
    tanggal_rilis: text(formData, "tanggal_rilis"),
    status: text(formData, "status"),
  };
  const errors = {};

  if (!values.judul) errors.judul = "Judul pengumuman wajib diisi.";
  else if (values.judul.length < 3 || values.judul.length > 200) errors.judul = "Judul harus 3-200 karakter.";

  if (!values.konten) errors.konten = "Isi pengumuman wajib diisi.";
  else if (values.konten.length < 10) errors.konten = "Isi pengumuman minimal 10 karakter.";
  else if (values.konten.length > 5000) errors.konten = "Isi pengumuman maksimal 5000 karakter.";

  if (!ANNOUNCEMENT_CATEGORIES.includes(values.kategori)) errors.kategori = "Kategori harus Operasional, Layanan, atau Acara.";

  if (!values.tanggal_rilis) errors.tanggal_rilis = "Tanggal rilis wajib diisi.";
  else if (!isRealDate(values.tanggal_rilis)) errors.tanggal_rilis = "Tanggal rilis tidak valid.";

  if (!ANNOUNCEMENT_STATUSES.includes(values.status)) errors.status = "Status harus Draft atau Published.";

  return { values, errors };
}

// ---------------------------------------------------------------------
// Hari 6: alasan penolakan peminjaman
// ---------------------------------------------------------------------
export function validateRejectReason(formData) {
  const alasan = String(formData.get("alasan") ?? "").trim();
  if (!alasan) return { alasan, error: "Alasan penolakan wajib diisi." };
  if (alasan.length < 3 || alasan.length > 300) return { alasan, error: "Alasan penolakan harus 3-300 karakter." };
  return { alasan, error: null };
}

// ---------------------------------------------------------------------
// Hari 7: validasi ulasan buku
// ---------------------------------------------------------------------
export function validateReview(formData) {
  const values = {
    rating: String(formData.get("rating") ?? "").trim(),
    komentar: String(formData.get("komentar") ?? "").trim(),
  };
  const errors = {};
  if (!values.rating) errors.rating = "Rating wajib dipilih.";
  else if (!/^[1-5]$/.test(values.rating)) errors.rating = "Rating harus 1 sampai 5.";

  if (!values.komentar) errors.komentar = "Komentar ulasan wajib diisi.";
  else if (values.komentar.length < 3) errors.komentar = "Komentar minimal 3 karakter.";
  else if (values.komentar.length > 1000) errors.komentar = "Komentar maksimal 1000 karakter.";

  return { values, errors };
}

// Request buku dari Mahasiswa. Hanya judul dan pengarang yang wajib.
export function validateBookRequest(formData) {
  const values = {
    judul: text(formData, "judul"),
    pengarang: text(formData, "pengarang"),
    penerbit: text(formData, "penerbit"),
    tahun_terbit: text(formData, "tahun_terbit"),
    alasan: text(formData, "alasan"),
  };
  const errors = {};
  const thisYear = new Date().getFullYear();

  if (!values.judul) errors.judul = "Judul buku wajib diisi.";
  else if (values.judul.length < 2 || values.judul.length > 200) errors.judul = "Judul harus 2-200 karakter.";

  if (!values.pengarang) errors.pengarang = "Pengarang wajib diisi.";
  else if (values.pengarang.length < 2 || values.pengarang.length > 150) errors.pengarang = "Pengarang harus 2-150 karakter.";

  if (values.penerbit.length > 150) errors.penerbit = "Penerbit maksimal 150 karakter.";

  if (values.tahun_terbit && (!INT.test(values.tahun_terbit) || Number(values.tahun_terbit) < 1000 || Number(values.tahun_terbit) > thisYear))
    errors.tahun_terbit = `Tahun terbit harus angka antara 1000 dan ${thisYear}.`;

  if (values.alasan.length > 500) errors.alasan = "Alasan maksimal 500 karakter.";

  return { values, errors };
}

// Catatan Admin atas request buku. Wajib saat menolak, opsional saat menyetujui.
export function validateRequestNote(formData, required) {
  const catatan = String(formData.get("catatan") ?? "").trim();
  if (required && !catatan) return { catatan, error: "Alasan penolakan wajib diisi." };
  if (catatan && (catatan.length < 3 || catatan.length > 300)) return { catatan, error: "Catatan harus 3-300 karakter." };
  return { catatan, error: null };
}
