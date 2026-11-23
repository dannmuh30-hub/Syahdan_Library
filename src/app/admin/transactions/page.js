import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import StatusBadge from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { formatRupiah, formatTanggal, formatTanggalWaktu } from "@/lib/format";

export const metadata = { title: "Monitoring Transaksi | Admin" };

const STATUSES = ["Menunggu Konfirmasi", "Sedang Dipinjam", "Selesai", "Ditolak"];
const PER_PAGE = 20;

async function Monitor({ searchParams }) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status) ? sp.status : "";
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const pattern = q ? `%${q.replace(/[\\%_]/g, "\\$&")}%` : null;
  const page = Math.min(10000, Math.max(1, Number.parseInt(sp.page, 10) || 1));
  const where = `($1::text IS NULL OR u.nama ILIKE $1 OR u.nomor_identitas ILIKE $1 OR b.judul ILIKE $1)
                 AND ($2::text = '' OR l.status = $2::text)`;
  const base = `FROM loans l JOIN users u ON u.id = l.user_id JOIN books b ON b.id = l.book_id JOIN v_loans_denda d ON d.loan_id = l.id WHERE ${where}`;

  const [{ rows: cnt }, { rows }] = await Promise.all([
    query(`SELECT COUNT(*)::int AS n ${base}`, [pattern, status]),
    query(
      `SELECT l.id, u.nama, u.nomor_identitas AS nim, b.judul, l.status, l.status_denda, l.denda_nominal,
              to_char(l.tanggal_pengajuan, 'YYYY-MM-DD HH24:MI') AS diajukan,
              to_char(l.tanggal_jatuh_tempo, 'YYYY-MM-DD') AS jatuh_tempo,
              to_char(l.tanggal_kembali, 'YYYY-MM-DD') AS kembali, d.hari_terlambat, d.denda_hitung
         ${base} ORDER BY l.tanggal_pengajuan DESC, l.id DESC LIMIT ${PER_PAGE} OFFSET $3::int`,
      [pattern, status, (page - 1) * PER_PAGE]
    ),
  ]);
  const pages = Math.max(1, Math.ceil(cnt[0].n / PER_PAGE));
  const href = (p) => {
    const u = new URLSearchParams();
    if (status) u.set("status", status);
    if (q) u.set("q", q);
    if (p > 1) u.set("page", String(p));
    const s = u.toString();
    return "/admin/transactions" + (s ? `?${s}` : "");
  };

  return (
    <>
      <form className="mb-4 flex flex-wrap gap-2" role="search">
        <input name="q" defaultValue={q} placeholder="Cari nama, NIM, atau judul" aria-label="Cari transaksi"
          className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <select name="status" defaultValue={status} aria-label="Filter status" className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
          <option value="">Semua status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900">Cari</button>
      </form>
      <p className="mb-2 text-sm text-stone-500">{cnt[0].n} transaksi</p>
      <div className="overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>{["Mahasiswa", "Buku", "Diajukan", "Jatuh tempo", "Dikembalikan", "Status", "Denda"].map((h) => <th key={h} className="px-4 py-2 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-stone-500">Tidak ada transaksi yang cocok.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-2 align-top">{r.nama}<div className="text-xs text-stone-500">{r.nim}</div></td>
                <td className="px-4 py-2 align-top">{r.judul}</td>
                <td className="px-4 py-2 align-top whitespace-nowrap">{formatTanggalWaktu(r.diajukan)}</td>
                <td className="px-4 py-2 align-top whitespace-nowrap">{r.jatuh_tempo ? formatTanggal(r.jatuh_tempo) : "-"}</td>
                <td className="px-4 py-2 align-top whitespace-nowrap">{r.kembali ? formatTanggal(r.kembali) : "-"}</td>
                <td className="px-4 py-2 align-top"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-2 align-top whitespace-nowrap">
                  {r.denda_nominal > 0 ? (
                    <span className={r.status_denda === "Tertunggak" ? "font-medium text-red-700" : "text-green-700"}>{formatRupiah(r.denda_nominal)} ({r.status_denda})</span>
                  ) : r.status === "Sedang Dipinjam" && r.hari_terlambat > 0 ? (
                    <span className="text-red-700">berjalan {formatRupiah(r.denda_hitung)}</span>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <nav className="mt-4 flex items-center justify-between text-sm" aria-label="Halaman">
          {page > 1 ? <Link href={href(page - 1)} className="text-amber-800 hover:underline">Sebelumnya</Link> : <span />}
          <span className="text-stone-500">Halaman {Math.min(page, pages)} dari {pages}</span>
          {page < pages ? <Link href={href(page + 1)} className="text-amber-800 hover:underline">Berikutnya</Link> : <span />}
        </nav>
      )}
    </>
  );
}

export default function TransactionsPage({ searchParams }) {
  return (
    <AdminShell title="Monitoring Transaksi">
      <Monitor searchParams={searchParams} />
    </AdminShell>
  );
}
