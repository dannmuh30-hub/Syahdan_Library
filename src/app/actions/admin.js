"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { query, withTransaction } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { parseId, validateCategoryForm, validateUserForm } from "@/lib/validation";






export async function createUserAction(prevState, formData) {
  await requireRole("admin");
  const { values, errors } = validateUserForm(formData, "create");
  const safe = { ...values, password: "" };
  if (Object.keys(errors).length > 0) return { errors, values: safe };

  const hash = await bcrypt.hash(values.password, 10);
  try {
    await query(
      `INSERT INTO users (nama, email, password_hash, role, nomor_identitas)
       VALUES ($1, $2, $3, $4, $5)`,
      [values.nama, values.email, hash, values.role, values.nomor_identitas]
    );
  } catch (err) {
    if (err.code === "23505") {
      const field = String(err.constraint).includes("email") ? "email" : "nomor_identitas";
      const msg = field === "email" ? "Email sudah terdaftar." : "Nomor identitas sudah terdaftar.";
      return { errors: { [field]: msg }, values: safe };
    }
    throw err;
  }
  redirect("/admin/users?ok=created");
}

export async function updateUserAction(prevState, formData) {
  await requireRole("admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect("/admin/users?err=notfound");

  const { values, errors } = validateUserForm(formData, "edit");
  const safe = { ...values, password: "" };
  if (Object.keys(errors).length > 0) return { errors, values: safe };

  
  
  
  let result;
  try {
    result = await query(
      `UPDATE users u SET nama = $1, email = $2, role = $3, is_active = $4
        WHERE u.id = $5 AND u.role <> 'admin'
          AND ($3::text <> 'pegawai' OR u.role <> 'mahasiswa' OR NOT EXISTS (
                SELECT 1 FROM loans l
                 WHERE l.user_id = u.id
                   AND (l.status IN ('Menunggu Konfirmasi', 'Sedang Dipinjam') OR l.status_denda = 'Tertunggak')))`,
      [values.nama, values.email, values.role, values.is_active, id]
    );
  } catch (err) {
    if (err.code === "23505") return { errors: { email: "Email sudah dipakai akun lain." }, values: safe };
    throw err;
  }
  if (result.rowCount === 0) {
    
    const { rows } = await query(
      `SELECT u.id,
              (SELECT COUNT(*)::int FROM loans l WHERE l.user_id = u.id AND l.status IN ('Menunggu Konfirmasi', 'Sedang Dipinjam')) AS aktif,
              (SELECT COUNT(*)::int FROM loans l WHERE l.user_id = u.id AND l.status_denda = 'Tertunggak') AS denda
         FROM users u WHERE u.id = $1 AND u.role <> 'admin'`,
      [id]
    );
    if (rows.length === 0) redirect("/admin/users?err=notfound");
    const alasan = [];
    if (rows[0].aktif > 0) alasan.push(`${rows[0].aktif} peminjaman yang masih berjalan`);
    if (rows[0].denda > 0) alasan.push(`${rows[0].denda} denda yang belum lunas`);
    return {
      errors: {
        role: `Belum bisa dijadikan Pegawai: mahasiswa ini masih punya ${alasan.join(" dan ") || "transaksi yang belum selesai"}. Selesaikan dulu semuanya.`,
      },
      values: safe,
    };
  }
  redirect("/admin/users?ok=updated");
}

export async function deleteUserAction(formData) {
  const admin = await requireRole("admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect("/admin/users?err=notfound");
  if (id === admin.id) redirect("/admin/users?err=self");

  
  
  
  const hasil = await withTransaction(async (client) => {
    const { rows: target } = await client.query("SELECT id FROM users WHERE id = $1 AND role <> 'admin' FOR UPDATE", [id]);
    if (target.length === 0) return "notfound";

    const { rows } = await client.query(
      `SELECT COUNT(*) FILTER (WHERE status IN ('Menunggu Konfirmasi', 'Sedang Dipinjam'))::int AS aktif,
              COUNT(*) FILTER (WHERE status_denda = 'Tertunggak')::int AS denda
         FROM loans WHERE user_id = $1`,
      [id]
    );
    if (rows[0].aktif > 0) return "active";
    if (rows[0].denda > 0) return "fine";

    await client.query("DELETE FROM book_requests WHERE user_id = $1", [id]);
    await client.query("DELETE FROM loans WHERE user_id = $1", [id]); 
    await client.query("DELETE FROM users WHERE id = $1 AND role <> 'admin'", [id]);
    return "deleted";
  });

  if (hasil === "deleted") redirect("/admin/users?ok=deleted");
  redirect(`/admin/users?err=${hasil}`);
}



function categoryUniqueError(err) {
  const field = String(err.constraint).includes("kode") ? "kode" : "nama";
  return { [field]: field === "kode" ? "Kode klasifikasi sudah dipakai." : "Nama kategori sudah dipakai." };
}

export async function createCategoryAction(prevState, formData) {
  await requireRole("admin");
  const { values, errors } = validateCategoryForm(formData);
  if (Object.keys(errors).length > 0) return { errors, values };

  try {
    await query("INSERT INTO categories (nama, kode, deskripsi) VALUES ($1, $2, $3)", [
      values.nama,
      values.kode,
      values.deskripsi || null,
    ]);
  } catch (err) {
    if (err.code === "23505") return { errors: categoryUniqueError(err), values };
    throw err;
  }
  redirect("/admin/categories?ok=created");
}

export async function updateCategoryAction(prevState, formData) {
  await requireRole("admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect("/admin/categories?err=notfound");

  const { values, errors } = validateCategoryForm(formData);
  if (Object.keys(errors).length > 0) return { errors, values };

  let result;
  try {
    result = await query("UPDATE categories SET nama = $1, kode = $2, deskripsi = $3 WHERE id = $4", [
      values.nama,
      values.kode,
      values.deskripsi || null,
      id,
    ]);
  } catch (err) {
    if (err.code === "23505") return { errors: categoryUniqueError(err), values };
    throw err;
  }
  if (result.rowCount === 0) redirect("/admin/categories?err=notfound");
  redirect("/admin/categories?ok=updated");
}

export async function deleteCategoryAction(formData) {
  await requireRole("admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect("/admin/categories?err=notfound");

  const { rows } = await query("SELECT COUNT(*)::int AS n FROM books WHERE category_id = $1", [id]);
  if (rows[0].n > 0) redirect("/admin/categories?err=inuse");

  let result;
  try {
    result = await query("DELETE FROM categories WHERE id = $1", [id]);
  } catch (err) {
    if (err.code === "23503") redirect("/admin/categories?err=inuse");
    throw err;
  }
  if (result.rowCount === 0) redirect("/admin/categories?err=notfound");
  redirect("/admin/categories?ok=deleted");
}
