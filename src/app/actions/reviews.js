"use server";

import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { parseId, validateReview } from "@/lib/validation";



export async function createReviewAction(prevState, formData) {
  const user = await requireRole("mahasiswa");
  const loanId = parseId(formData.get("loan_id"));
  if (!loanId) redirect("/mahasiswa/loans?err=notfound");

  const { values, errors } = validateReview(formData);
  if (Object.keys(errors).length > 0) return { errors, values };

  let created;
  try {
    
    const result = await query(
      `INSERT INTO reviews (loan_id, user_id, book_id, rating, komentar)
       SELECT l.id, l.user_id, l.book_id, $3::int, $4
         FROM loans l
        WHERE l.id = $1 AND l.user_id = $2 AND l.status = 'Selesai'`,
      [loanId, user.id, Number(values.rating), values.komentar]
    );
    created = result.rowCount === 1;
  } catch (err) {
    if (err.code === "23505") redirect("/mahasiswa/loans?err=reviewed");
    throw err;
  }
  if (!created) redirect("/mahasiswa/loans?err=notfound");
  redirect("/mahasiswa/loans?ok=reviewed");
}
