"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { validateProfile, validatePasswordChange } from "@/lib/validation";



export async function updateProfileAction(prevState, formData) {
  const user = await requireRole("admin", "pegawai", "mahasiswa");
  const { values, errors } = validateProfile(formData, user.role);
  if (Object.keys(errors).length > 0) return { errors, values };

  try {
    await query("UPDATE users SET nama = $1, email = $2 WHERE id = $3", [values.nama, values.email, user.id]);
  } catch (err) {
    if (err.code === "23505") return { errors: { email: "Email sudah dipakai akun lain." }, values };
    throw err;
  }
  redirect("/profil?ok=profil");
}

export async function changePasswordAction(prevState, formData) {
  const user = await requireRole("admin", "pegawai", "mahasiswa");
  const { errors } = validatePasswordChange(formData);
  if (Object.keys(errors).length > 0) return { errors };

  const { rows } = await query("SELECT password_hash FROM users WHERE id = $1", [user.id]);
  const cocok = rows[0] && (await bcrypt.compare(String(formData.get("lama")), rows[0].password_hash));
  if (!cocok) return { errors: { lama: "Password saat ini salah." } };

  const hash = await bcrypt.hash(String(formData.get("baru")), 10);
  await query("UPDATE users SET password_hash = $1 WHERE id = $2", [hash, user.id]);
  redirect("/profil?ok=password");
}




const MAX_FOTO = 2 * 1024 * 1024; 


function sniffImage(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return null;
}

export async function updatePhotoAction(prevState, formData) {
  const user = await requireRole("admin", "pegawai", "mahasiswa");
  const file = formData.get("foto");
  if (!file || typeof file === "string" || file.size === 0) return { error: "Pilih file foto terlebih dahulu." };
  if (file.size > MAX_FOTO) return { error: "Ukuran foto maksimal 2 MB." };

  const buf = Buffer.from(await file.arrayBuffer());
  const tipe = sniffImage(buf);
  if (!tipe) return { error: "Format foto harus JPG, PNG, atau WebP." };

  await query("UPDATE users SET foto_data = $1, foto_tipe = $2, foto_diubah = NOW() WHERE id = $3", [buf, tipe, user.id]);
  redirect("/profil?ok=foto");
}

export async function removePhotoAction() {
  const user = await requireRole("admin", "pegawai", "mahasiswa");
  await query("UPDATE users SET foto_data = NULL, foto_tipe = NULL, foto_diubah = NULL WHERE id = $1", [user.id]);
  redirect("/profil?ok=fotohapus");
}
