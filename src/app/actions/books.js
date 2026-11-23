"use server";

import { redirect } from "next/navigation";
import { query, withTransaction } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { parseId, validateBookForm } from "@/lib/validation";

// Book Management: menambah dan menghapus buku hanya Admin; mengubah data buku boleh Pegawai dan Admin.
// Role dicek ulang di setiap action.
const BOOKS = "/pegawai/books";

function toDb(v) {
  return {
    tahun: Number(v.tahun_terbit),
    category: Number(v.category_id),
    stok: Number(v.stok_total),
    durasi: Number(v.durasi_maks_pinjam),
    denda: Number(v.denda_per_hari),
    cover: v.cover_url || null,
    deskripsi: v.deskripsi || null,
  };
}

export async function createBookAction(prevState, formData) {
  const admin = await requireRole("admin");
  const { values, errors } = validateBookForm(formData, "create");
  const requestId = parseId(formData.get("request_id"));
  if (Object.keys(errors).length > 0) return { errors, values, requestId };

  const d = toDb(values);
  try {
    await withTransaction(async (client) => {
      // Judul yang sama (tanpa membedakan huruf besar/kecil) tidak boleh didaftarkan dua kali.
      const dup = await client.query("SELECT 1 FROM books WHERE lower(judul) = lower($1)", [values.judul]);
      if (dup.rows.length > 0) throw Object.assign(new Error("duplicate title"), { code: "DUP_TITLE" });

      // Buku baru: seluruh eksemplar tersedia (stok_tersedia = stok_total).
      await client.query(
        `INSERT INTO books (judul, isbn, pengarang, penerbit, tahun_terbit, category_id,
                            stok_total, stok_tersedia, durasi_maks_pinjam, denda_per_hari, cover_url, deskripsi)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8, $9, $10, $11)`,
        [values.judul, values.isbn, values.pengarang, values.penerbit, d.tahun, d.category, d.stok, d.durasi, d.denda, d.cover, d.deskripsi]
      );
      // Bila berasal dari request yang disetujui, tandai sudah ditambahkan ke koleksi.
      if (requestId) {
        await client.query(
          "UPDATE book_requests SET status = 'Ditambahkan', reviewed_by = $2, reviewed_at = NOW() WHERE id = $1 AND status = 'Disetujui'",
          [requestId, admin.id]
        );
      }
    });
  } catch (err) {
    if (err.code === "DUP_TITLE") return { errors: { judul: "Buku dengan judul ini sudah ada di koleksi." }, values, requestId };
    if (err.code === "23505") return { errors: { isbn: "ISBN sudah terdaftar." }, values, requestId };
    if (err.code === "23503") return { errors: { category_id: "Kategori tidak ditemukan." }, values, requestId };
    throw err;
  }
  redirect(`${BOOKS}?ok=created`);
}

export async function updateBookAction(prevState, formData) {
  await requireRole("pegawai", "admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect(`${BOOKS}?err=notfound`);

  const { values, errors } = validateBookForm(formData, "edit");
  if (Object.keys(errors).length > 0) return { errors, values };
  const d = toDb(values);

  let outcome;
  try {
    outcome = await withTransaction(async (client) => {
      const { rows } = await client.query(
        "SELECT stok_total, stok_tersedia FROM books WHERE id = $1 FOR UPDATE",
        [id]
      );
      if (!rows[0]) return { notFound: true };

      // Eksemplar yang sedang dipinjam = stok_total - stok_tersedia.
      const dipinjam = rows[0].stok_total - rows[0].stok_tersedia;
      if (d.stok < dipinjam) {
        return { errors: { stok_total: `Stok tidak boleh kurang dari jumlah yang sedang dipinjam (${dipinjam}).` } };
      }
      await client.query(
        `UPDATE books
            SET judul = $1, pengarang = $2, penerbit = $3, tahun_terbit = $4, category_id = $5,
                stok_total = $6::int, stok_tersedia = $6::int - $7::int, durasi_maks_pinjam = $8,
                denda_per_hari = $9, cover_url = $10, deskripsi = $11
          WHERE id = $12`,
        [values.judul, values.pengarang, values.penerbit, d.tahun, d.category, d.stok, dipinjam, d.durasi, d.denda, d.cover, d.deskripsi, id]
      );
      return { ok: true };
    });
  } catch (err) {
    if (err.code === "23503") return { errors: { category_id: "Kategori tidak ditemukan." }, values };
    throw err;
  }

  if (outcome.notFound) redirect(`${BOOKS}?err=notfound`);
  if (outcome.errors) return { errors: outcome.errors, values };
  redirect(`${BOOKS}?ok=updated`);
}

export async function deleteBookAction(formData) {
  await requireRole("admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect(`${BOOKS}?err=notfound`);

  const { rows } = await query(
    `SELECT COUNT(*) FILTER (WHERE status IN ('Menunggu Konfirmasi', 'Sedang Dipinjam'))::int AS aktif,
            COUNT(*)::int AS total
       FROM loans WHERE book_id = $1`,
    [id]
  );
  if (rows[0].aktif > 0) redirect(`${BOOKS}?err=active`);
  if (rows[0].total > 0) redirect(`${BOOKS}?err=history`);

  let result;
  try {
    result = await query("DELETE FROM books WHERE id = $1", [id]);
  } catch (err) {
    if (err.code === "23503") redirect(`${BOOKS}?err=history`);
    throw err;
  }
  if (result.rowCount === 0) redirect(`${BOOKS}?err=notfound`);
  redirect(`${BOOKS}?ok=deleted`);
}
