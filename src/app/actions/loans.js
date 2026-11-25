"use server";

import { redirect } from "next/navigation";
import { query, withTransaction } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { parseId, validateRejectReason } from "@/lib/validation";
import { MAX_PERPANJANGAN } from "@/lib/rules";



export async function ajukanPinjamAction(formData) {
  const user = await requireRole("mahasiswa");
  const bookId = parseId(formData.get("book_id"));
  if (!bookId) redirect("/katalog");
  const back = `/buku/${bookId}`;

  const { rows: books } = await query("SELECT stok_tersedia FROM books WHERE id = $1", [bookId]);
  if (!books[0]) redirect("/katalog");
  if (books[0].stok_tersedia <= 0) redirect(`${back}?err=stok`);

  
  const { rows: denda } = await query(
    "SELECT 1 FROM loans WHERE user_id = $1 AND status_denda = 'Tertunggak' LIMIT 1",
    [user.id]
  );
  if (denda.length > 0) redirect(`${back}?err=denda`);

  try {
    await query("INSERT INTO loans (user_id, book_id) VALUES ($1, $2)", [user.id, bookId]);
  } catch (err) {
    
    if (err.code === "23505") redirect(`${back}?err=duplicate`);
    throw err;
  }
  redirect(`${back}?ok=requested`);
}








const LOANS = "/pegawai/loans";

export async function approveLoanAction(formData) {
  const staff = await requireRole("pegawai", "admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect(`${LOANS}?err=notfound`);

  const code = await withTransaction(async (client) => {
    const { rows: loans } = await client.query(
      "SELECT user_id, book_id, status FROM loans WHERE id = $1 FOR UPDATE",
      [id]
    );
    const loan = loans[0];
    if (!loan) return "notfound";
    if (loan.status !== "Menunggu Konfirmasi") return "state"; 

    const { rows: books } = await client.query(
      "SELECT stok_tersedia, durasi_maks_pinjam FROM books WHERE id = $1 FOR UPDATE",
      [loan.book_id]
    );
    const book = books[0];
    if (!book || book.stok_tersedia <= 0) return "stok";

    const { rows: denda } = await client.query(
      "SELECT 1 FROM loans WHERE user_id = $1 AND status_denda = 'Tertunggak' LIMIT 1",
      [loan.user_id]
    );
    if (denda.length > 0) return "denda";

    await client.query("UPDATE books SET stok_tersedia = stok_tersedia - 1 WHERE id = $1", [loan.book_id]);
    await client.query(
      `UPDATE loans
          SET status = 'Sedang Dipinjam',
              tanggal_pinjam = CURRENT_DATE,
              tanggal_jatuh_tempo = CURRENT_DATE + $2::int,
              approved_by = $3
        WHERE id = $1`,
      [id, book.durasi_maks_pinjam, staff.id]
    );
    return "ok";
  });

  if (code === "ok") redirect(`${LOANS}?ok=approved`);
  redirect(`${LOANS}?err=${code}`);
}

export async function rejectLoanAction(formData) {
  const staff = await requireRole("pegawai", "admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect(`${LOANS}?err=notfound`);
  const { alasan, error } = validateRejectReason(formData);
  if (error) redirect(`${LOANS}?err=reason`);

  
  const result = await query(
    `UPDATE loans
        SET status = 'Ditolak', alasan_penolakan = $2, approved_by = $3
      WHERE id = $1 AND status = 'Menunggu Konfirmasi'`,
    [id, alasan, staff.id]
  );
  if (result.rowCount === 0) {
    const { rows } = await query("SELECT 1 FROM loans WHERE id = $1", [id]);
    redirect(`${LOANS}?err=${rows.length ? "state" : "notfound"}`);
  }
  redirect(`${LOANS}?ok=rejected`);
}

export async function returnLoanAction(formData) {
  const staff = await requireRole("pegawai", "admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect(`${LOANS}?tab=dipinjam&err=notfound`);

  const code = await withTransaction(async (client) => {
    const { rows: loans } = await client.query(
      "SELECT book_id, status FROM loans WHERE id = $1 FOR UPDATE",
      [id]
    );
    const loan = loans[0];
    if (!loan) return "notfound";
    if (loan.status !== "Sedang Dipinjam") return "state";

    const { rows: books } = await client.query(
      "SELECT denda_per_hari FROM books WHERE id = $1 FOR UPDATE",
      [loan.book_id]
    );

    
    await client.query(
      "UPDATE books SET stok_tersedia = LEAST(stok_total, stok_tersedia + 1) WHERE id = $1",
      [loan.book_id]
    );

    
    const { rows: done } = await client.query(
      `UPDATE loans
          SET status = 'Selesai',
              tanggal_kembali = CURRENT_DATE,
              returned_by = $2,
              denda_nominal = GREATEST(0, CURRENT_DATE - tanggal_jatuh_tempo) * $3::int,
              status_denda = CASE WHEN GREATEST(0, CURRENT_DATE - tanggal_jatuh_tempo) * $3::int > 0
                                  THEN 'Tertunggak' ELSE 'Tidak Ada' END
        WHERE id = $1
        RETURNING denda_nominal`,
      [id, staff.id, books[0].denda_per_hari]
    );
    return done[0].denda_nominal > 0 ? "returned_denda" : "returned";
  });

  if (code.startsWith("returned")) redirect(`${LOANS}?tab=dipinjam&ok=${code}`);
  redirect(`${LOANS}?tab=dipinjam&err=${code}`);
}






const MY_LOANS = "/mahasiswa/loans";

export async function requestExtensionAction(formData) {
  const user = await requireRole("mahasiswa");
  const id = parseId(formData.get("id"));
  if (!id) redirect(`${MY_LOANS}?err=notfound`);

  const result = await query(
    `UPDATE loans
        SET status_perpanjangan = 'Perpanjangan Diajukan'
      WHERE id = $1 AND user_id = $2
        AND status = 'Sedang Dipinjam'
        AND status_perpanjangan <> 'Perpanjangan Diajukan'
        AND jumlah_perpanjangan < $3
        AND tanggal_jatuh_tempo >= CURRENT_DATE`,
    [id, user.id, MAX_PERPANJANGAN]
  );
  if (result.rowCount === 1) redirect(`${MY_LOANS}?ok=ext_requested`);

  
  const { rows } = await query(
    `SELECT status, status_perpanjangan, jumlah_perpanjangan, (tanggal_jatuh_tempo < CURRENT_DATE) AS lewat
       FROM loans WHERE id = $1 AND user_id = $2`,
    [id, user.id]
  );
  const l = rows[0];
  let code = "notfound";
  if (l) {
    if (l.status !== "Sedang Dipinjam") code = "ext_state";
    else if (l.status_perpanjangan === "Perpanjangan Diajukan") code = "ext_pending";
    else if (l.jumlah_perpanjangan >= MAX_PERPANJANGAN) code = "ext_max";
    else if (l.lewat) code = "ext_overdue";
    else code = "ext_state";
  }
  redirect(`${MY_LOANS}?err=${code}`);
}

export async function approveExtensionAction(formData) {
  await requireRole("pegawai", "admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect(`${LOANS}?tab=perpanjangan&err=notfound`);

  
  const result = await query(
    `UPDATE loans l
        SET tanggal_jatuh_tempo = l.tanggal_jatuh_tempo + b.durasi_maks_pinjam,
            jumlah_perpanjangan = l.jumlah_perpanjangan + 1,
            status_perpanjangan = 'Perpanjangan Disetujui'
       FROM books b
      WHERE b.id = l.book_id AND l.id = $1
        AND l.status = 'Sedang Dipinjam' AND l.status_perpanjangan = 'Perpanjangan Diajukan'`,
    [id]
  );
  if (result.rowCount === 0) redirect(`${LOANS}?tab=perpanjangan&err=state`);
  redirect(`${LOANS}?tab=perpanjangan&ok=ext_approved`);
}

export async function rejectExtensionAction(formData) {
  await requireRole("pegawai", "admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect(`${LOANS}?tab=perpanjangan&err=notfound`);

  const result = await query(
    `UPDATE loans SET status_perpanjangan = 'Perpanjangan Ditolak'
      WHERE id = $1 AND status = 'Sedang Dipinjam' AND status_perpanjangan = 'Perpanjangan Diajukan'`,
    [id]
  );
  if (result.rowCount === 0) redirect(`${LOANS}?tab=perpanjangan&err=state`);
  redirect(`${LOANS}?tab=perpanjangan&ok=ext_rejected`);
}




export async function markFinePaidAction(formData) {
  await requireRole("pegawai", "admin");
  const id = parseId(formData.get("id"));
  if (!id) redirect(`${LOANS}?tab=denda&err=notfound`);

  const result = await query(
    `UPDATE loans SET status_denda = 'Lunas'
      WHERE id = $1 AND status = 'Selesai' AND status_denda = 'Tertunggak'`,
    [id]
  );
  if (result.rowCount === 0) redirect(`${LOANS}?tab=denda&err=state`);
  redirect(`${LOANS}?tab=denda&ok=fine_paid`);
}
