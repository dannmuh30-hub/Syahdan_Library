"use server";

import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { parseId, validateBookRequest, validateRequestNote } from "@/lib/validation";



const MY = "/mahasiswa/requests";
const ADMIN = "/admin/requests";
const MAX_MENUNGGU = 3;

export async function createRequestAction(prevState, formData) {
  const user = await requireRole("mahasiswa");
  const { values, errors } = validateBookRequest(formData);
  if (Object.keys(errors).length > 0) return { errors, values };

  const { rows: ada } = await query("SELECT 1 FROM books WHERE lower(judul) = lower($1)", [values.judul]);
  if (ada.length > 0) return { errors: { judul: "Buku ini sudah ada di katalog. Cari di halaman Katalog." }, values };

  const { rows: cnt } = await query(
    "SELECT COUNT(*)::int AS n FROM book_requests WHERE user_id = $1 AND status = 'Menunggu'",
    [user.id]
  );
  if (cnt[0].n >= MAX_MENUNGGU) {
    return { errors: { judul: `Maksimal ${MAX_MENUNGGU} request yang menunggu. Tunggu peninjauan atau batalkan salah satu.` }, values };
  }

  try {
    await query(
      `INSERT INTO book_requests (user_id, judul, pengarang, penerbit, tahun_terbit, alasan)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        user.id,
        values.judul,
        values.pengarang,
        values.penerbit || null,
        values.tahun_terbit ? Number(values.tahun_terbit) : null,
        values.alasan || null,
      ]
    );
  } catch (err) {
    if (err.code === "23505") return { errors: { judul: "Kamu sudah meminta judul ini dan masih menunggu peninjauan." }, values };
    throw err;
  }
  
  redirect(`${MY}?ok=created&n=${Date.now()}`);
}

export async function cancelRequestAction(formData) {
  const user = await requireRole("mahasiswa");
  const id = parseId(formData.get("id"));
  if (!id) redirect(`${MY}?err=notfound`);
  
  const result = await query(
    "DELETE FROM book_requests WHERE id = $1 AND user_id = $2 AND status = 'Menunggu'",
    [id, user.id]
  );
  if (result.rowCount === 0) redirect(`${MY}?err=state`);
  redirect(`${MY}?ok=cancelled`);
}

async function review(formData, { status, noteRequired }) {
  const admin = await requireRole("admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect(`${ADMIN}?err=notfound`);
  const { catatan, error } = validateRequestNote(formData, noteRequired);
  if (error) redirect(`${ADMIN}?err=${noteRequired ? "reason" : "note"}`);

  
  const result = await query(
    `UPDATE book_requests
        SET status = $2, catatan_admin = $3, reviewed_by = $4, reviewed_at = NOW()
      WHERE id = $1 AND status = 'Menunggu'`,
    [id, status, catatan || null, admin.id]
  );
  if (result.rowCount === 0) {
    const { rows } = await query("SELECT 1 FROM book_requests WHERE id = $1", [id]);
    redirect(`${ADMIN}?err=${rows.length ? "state" : "notfound"}`);
  }
  redirect(`${ADMIN}?ok=${status === "Disetujui" ? "approved" : "rejected"}`);
}

export async function approveRequestAction(formData) {
  await review(formData, { status: "Disetujui", noteRequired: false });
}

export async function rejectRequestAction(formData) {
  await review(formData, { status: "Ditolak", noteRequired: true });
}
