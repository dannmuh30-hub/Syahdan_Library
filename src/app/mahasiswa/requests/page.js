import MahasiswaShell from "@/components/MahasiswaShell";
import RequestForm from "@/components/RequestForm";
import Flash from "@/components/Flash";
import StatusBadge from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { cancelRequestAction } from "@/app/actions/requests";
import { formatTanggal } from "@/lib/format";

export const metadata = { title: "Request Buku" };

const MESSAGES = {
  ok: { created: "Request terkirim. Admin akan meninjaunya.", cancelled: "Request dibatalkan." },
  err: { notfound: "Request tidak ditemukan.", state: "Request ini sudah diproses atau bukan milikmu." },
};

async function Requests({ user, searchParams }) {
  const sp = await searchParams;
  const { rows } = await query(
    `SELECT id, judul, pengarang, penerbit, tahun_terbit, alasan, status, catatan_admin,
            to_char(created_at, 'YYYY-MM-DD') AS tanggal
       FROM book_requests WHERE user_id = $1 ORDER BY created_at DESC, id DESC`,
    [user.id]
  );
  return (
    <>
      <Flash ok={sp.ok} err={sp.err} messages={MESSAGES} />
      <p className="mb-4 text-sm text-stone-600">
        Tidak menemukan buku yang kamu cari di katalog? Usulkan di sini. Admin akan meninjau dan menambahkannya ke koleksi bila disetujui.
      </p>
      <RequestForm key={typeof sp.n === "string" ? sp.n : "form"} />

      <section aria-labelledby="riwayat" className="mt-10">
        <h2 id="riwayat" className="mb-3 text-lg font-semibold text-stone-900">Request saya</h2>
        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">Belum ada request.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => (
              <li key={r.id} className="rounded-xl border border-stone-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-stone-900">{r.judul}</p>
                    <p className="text-sm text-stone-600">
                      {r.pengarang}
                      {r.penerbit && ` · ${r.penerbit}`}
                      {r.tahun_terbit && ` · ${r.tahun_terbit}`}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                {r.alasan && <p className="mt-2 text-sm text-stone-700">Alasan: {r.alasan}</p>}
                {r.catatan_admin && <p className="mt-2 text-sm text-stone-700">Catatan Admin: {r.catatan_admin}</p>}
                <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
                  <span>Diajukan {formatTanggal(r.tanggal)}</span>
                  {r.status === "Menunggu" && (
                    <form action={cancelRequestAction}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className="font-medium text-red-700 hover:underline">Batalkan</button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default function RequestsPage({ searchParams }) {
  return (
    <MahasiswaShell title="Request Buku">
      {(user) => <Requests user={user} searchParams={searchParams} />}
    </MahasiswaShell>
  );
}
