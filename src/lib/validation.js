const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData, key) {
  return String(formData.get(key) ?? "").trim();
}

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
