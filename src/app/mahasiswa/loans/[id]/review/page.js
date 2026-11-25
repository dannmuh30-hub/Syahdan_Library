import { notFound } from "next/navigation";
import MahasiswaShell from "@/components/MahasiswaShell";
import ReviewForm from "@/components/ReviewForm";
import { query } from "@/lib/db";
import { parseId } from "@/lib/validation";
import { formatTanggal } from "@/lib/format";

export const metadata = { title: "Tulis Ulasan" };

async function ReviewPage({ params, user }) {
  const id = parseId((await params).id);
  if (!id) notFound();

  
  const { rows } = await query(
    `SELECT l.id, l.book_id, b.judul, b.pengarang, to_char(l.tanggal_kembali, 'YYYY-MM-DD') AS kembali
       FROM loans l JOIN books b ON b.id = l.book_id
      WHERE l.id = $1 AND l.user_id = $2 AND l.status = 'Selesai'`,
    [id, user.id]
  );
  const loan = rows[0];
  if (!loan) notFound();

  const { rows: existing } = await query(
    "SELECT rating, komentar FROM reviews WHERE user_id = $1 AND book_id = $2",
    [user.id, loan.book_id]
  );

  return (
    <>
      <p className="mb-4 text-stone-600">
        <span className="font-medium text-stone-900">{loan.judul}</span> · {loan.pengarang}
        <br />
        <span className="text-sm">Dikembalikan {formatTanggal(loan.kembali)}</span>
      </p>
      {existing[0] ? (
        <div className="max-w-xl rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-500">Kamu sudah memberi ulasan untuk buku ini.</p>
          <p className="mt-1 text-amber-600" aria-label={`Rating ${existing[0].rating} dari 5`}>
            {"★".repeat(existing[0].rating)}
            <span className="text-stone-300">{"★".repeat(5 - existing[0].rating)}</span>
          </p>
          <p className="mt-1 text-stone-800">{existing[0].komentar}</p>
        </div>
      ) : (
        <ReviewForm loanId={loan.id} />
      )}
    </>
  );
}

export default function ReviewRoute({ params }) {
  return (
    <MahasiswaShell title="Tulis Ulasan">
      {(user) => <ReviewPage params={params} user={user} />}
    </MahasiswaShell>
  );
}
