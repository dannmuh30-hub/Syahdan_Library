import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import Flash from "@/components/Flash";
import StatusBadge from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { approveRequestAction, rejectRequestAction } from "@/app/actions/requests";
import { formatTanggal } from "@/lib/format";

export const metadata = { title: "Request Buku | Admin" };

const MESSAGES = {
  ok: { approved: "Request disetujui. Tambahkan bukunya ke koleksi dengan tombol di tab Disetujui.", rejected: "Request ditolak." },
  err: {
    notfound: "Request tidak ditemukan.",
    state: "Request ini sudah diproses.",
    reason: "Alasan penolakan wajib diisi (3-300 karakter).",
    note: "Catatan harus 3-300 karakter.",
  },
};
const TABS = [
  { key: "menunggu", label: "Menunggu", where: "r.status = 'Menunggu'" },
  { key: "disetujui", label: "Disetujui", where: "r.status = 'Disetujui'" },
  { key: "riwayat", label: "Riwayat", where: "r.status IN ('Ditambahkan', 'Ditolak')" },
];

async function Requests({ searchParams }) {
  const sp = await searchParams;
  const tab = TABS.find((t) => t.key === sp.tab) ?? TABS[0];
  const [{ rows: cnt }, { rows }] = await Promise.all([
    query(
      `SELECT COUNT(*) FILTER (WHERE status = 'Menunggu')::int AS menunggu,
              COUNT(*) FILTER (WHERE status = 'Disetujui')::int AS disetujui
         FROM book_requests`
    ),
    query(
      `SELECT r.id, r.judul, r.pengarang, r.penerbit, r.tahun_terbit, r.alasan, r.status, r.catatan_admin,
              to_char(r.created_at, 'YYYY-MM-DD') AS tanggal, u.nama, u.nomor_identitas AS nim
         FROM book_requests r JOIN users u ON u.id = r.user_id
        WHERE ${tab.where}
        ORDER BY r.created_at ASC, r.id ASC`
    ),
  ]);
  return (
    <>
      <Flash ok={sp.ok} err={sp.err} messages={MESSAGES} />
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Status request">
        {TABS.map((t) => {
          const n = t.key === "riwayat" ? null : cnt[0][t.key];
          const active = t.key === tab.key;
          return (
            <Link
              key={t.key}
              href={`/admin/requests?tab=${t.key}`}
              role="tab"
              aria-selected={active}
              className={"rounded-full border px-3 py-1 text-sm " + (active ? "border-amber-800 bg-amber-800 text-white" : "border-stone-300 text-stone-700 hover:bg-stone-100")}
            >
              {t.label}
              {n !== null && ` (${n})`}
            </Link>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">Tidak ada request pada tab ini.</p>
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
                  <p className="mt-1 text-xs text-stone-500">
                    Diminta {r.nama} ({r.nim}) pada {formatTanggal(r.tanggal)}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              {r.alasan && <p className="mt-2 text-sm text-stone-700">Alasan: {r.alasan}</p>}
              {r.catatan_admin && <p className="mt-2 text-sm text-stone-700">Catatan Admin: {r.catatan_admin}</p>}

              {r.status === "Menunggu" && (
                <form className="mt-3 flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <input
                    name="catatan"
                    placeholder="Catatan (wajib saat menolak)"
                    aria-label={`Catatan untuk ${r.judul}`}
                    maxLength={300}
                    className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-stone-50 px-3 py-1.5 text-sm"
                  />
                  <button formAction={approveRequestAction} className="rounded-lg bg-green-700 px-3 py-1.5 text-sm font-medium text-white hover:brightness-110">
                    Setujui
                  </button>
                  <button formAction={rejectRequestAction} className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50">
                    Tolak
                  </button>
                </form>
              )}
              {r.status === "Disetujui" && (
                <Link href={`/pegawai/books/new?request=${r.id}`} className="mt-3 inline-block rounded-lg bg-amber-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-900">
                  Tambahkan ke koleksi
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function RequestsPage({ searchParams }) {
  return (
    <AdminShell title="Request Buku">
      <Requests searchParams={searchParams} />
    </AdminShell>
  );
}
