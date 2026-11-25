"use server";

import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { parseId, validateAnnouncementForm } from "@/lib/validation";


const LIST = "/pegawai/announcements";

export async function createAnnouncementAction(prevState, formData) {
  const user = await requireRole("pegawai", "admin");
  const { values, errors } = validateAnnouncementForm(formData);
  if (Object.keys(errors).length > 0) return { errors, values };

  await query(
    `INSERT INTO announcements (judul, konten, kategori, tanggal_rilis, status, author_id)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [values.judul, values.konten, values.kategori, values.tanggal_rilis, values.status, user.id]
  );
  redirect(`${LIST}?ok=created`);
}

export async function updateAnnouncementAction(prevState, formData) {
  await requireRole("pegawai", "admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect(`${LIST}?err=notfound`);

  const { values, errors } = validateAnnouncementForm(formData);
  if (Object.keys(errors).length > 0) return { errors, values };

  const result = await query(
    `UPDATE announcements
        SET judul = $1, konten = $2, kategori = $3, tanggal_rilis = $4, status = $5
      WHERE id = $6`,
    [values.judul, values.konten, values.kategori, values.tanggal_rilis, values.status, id]
  );
  if (result.rowCount === 0) redirect(`${LIST}?err=notfound`);
  redirect(`${LIST}?ok=updated`);
}

export async function deleteAnnouncementAction(formData) {
  await requireRole("pegawai", "admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect(`${LIST}?err=notfound`);
  const result = await query("DELETE FROM announcements WHERE id = $1", [id]);
  if (result.rowCount === 0) redirect(`${LIST}?err=notfound`);
  redirect(`${LIST}?ok=deleted`);
}
