import Link from "next/link";
import StaffShell from "@/components/StaffShell";
import ConfirmForm from "@/components/ConfirmForm";
import Flash from "@/components/Flash";
import StatusBadge from "@/components/StatusBadge";
import { query } from "@/lib/db";
import {
  approveLoanAction,
  rejectLoanAction,
  returnLoanAction,
  approveExtensionAction,
  rejectExtensionAction,
  markFinePaidAction,
} from "@/app/actions/loans";
import { formatRupiah, formatTanggal, formatTanggalWaktu } from "@/lib/format";

export const metadata = { title: "Peminjaman | Pegawai" };

const MESSAGES = {
  ok: {
    approved: "Peminjaman disetujui. Stok buku berkurang 1 dan tanggal jatuh tempo ditetapkan.",
    rejected: "Pengajuan ditolak.",
    returned: "Pengembalian dikonfirmasi. Stok buku bertambah 1.",
    returned_denda: "Pengembalian dikonfirmasi dengan keterlambatan. Denda dicatat sebagai tertunggak (lihat tab Denda).",
    ext_approved: "Perpanjangan disetujui. Tanggal jatuh tempo bertambah otomatis.",
    ext_rejected: "Perpanjangan ditolak. Jatuh tempo tidak berubah.",
    fine_paid: "Denda dicatat lunas. Mahasiswa dapat mengajukan peminjaman kembali jika tidak ada denda tertunggak lain.",
  },
  err: {
    notfound: "Transaksi tidak ditemukan.",
    state: "Transaksi ini sudah diproses sebelumnya. Data telah dimuat ulang.",
    stok: "Tidak dapat disetujui: stok buku habis.",
    denda: "Tidak dapat disetujui: mahasiswa masih memiliki denda tertunggak. Tolak pengajuan atau tunggu pelunasan.",
    reason: "Alasan penolakan wajib diisi (3-300 karakter).",
  },
};

const TABS = [
  { key: "antrean", label: "Antrean" },
  { key: "perpanjangan", label: "Perpanjangan" },
  { key: "dipinjam", label: "Sedang Dipinjam" },
  { key: "denda", label: "Denda" },
  { key: "riwayat", label: "Riwayat" },
];

const SEARCH = `($1::text IS NULL OR u.nama ILIKE $1 OR u.nomor_identitas ILIKE $1 OR b.judul ILIKE $1)`;
const th = "px-4 py-2 font-medium";
const td = "px-4 py-2 align-top";

function Table({ head, children, empty, colSpan, isEmpty }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone-50 text-stone-600">
          <tr>
            {head.map((h) => (
              <th key={h} className={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {isEmpty ? (
            <tr>
              <td colSpan={colSpan} className="px-4 py-6 text-center text-stone-500">
                {empty}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

function Person({ nama, nim }) {
  return (
    <>
      {nama}
      <div className="text-xs text-stone-500">{nim}</div>
    </>
  );
}

async function LoanDesk({ searchParams }) {
  const sp = await searchParams;
  const tab = TABS.some((t) => t.key === sp.tab) ? sp.tab : "antrean";
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const pattern = q ? `%${q.replace(/[\\%_]/g, "\\$&")}%` : null;

  const { rows: counts } = await query(
    `SELECT COUNT(*) FILTER (WHERE status = 'Menunggu Konfirmasi')::int AS antrean,
            COUNT(*) FILTER (WHERE status = 'Sedang Dipinjam')::int AS dipinjam,
            COUNT(*) FILTER (WHERE status = 'Sedang Dipinjam' AND status_perpanjangan = 'Perpanjangan Diajukan')::int AS perpanjangan,
            COUNT(*) FILTER (WHERE status = 'Selesai' AND status_denda = 'Tertunggak')::int AS denda
       FROM loans`
  );

  let rows = [];
  if (tab === "antrean") {
    ({ rows } = await query(
      `SELECT l.id, u.nama, u.nomor_identitas AS nim, b.judul, b.stok_tersedia,
              to_char(l.tanggal_pengajuan, 'YYYY-MM-DD HH24:MI') AS diajukan
         FROM loans l JOIN users u ON u.id = l.user_id JOIN books b ON b.id = l.book_id
        WHERE l.status = 'Menunggu Konfirmasi' AND ${SEARCH}
        ORDER BY l.tanggal_pengajuan ASC, l.id ASC`,
      [pattern]
    ));
  } else if (tab === "dipinjam") {
    
    ({ rows } = await query(
      `SELECT l.id, u.nama, u.nomor_identitas AS nim, b.judul,
              to_char(l.tanggal_pinjam, 'YYYY-MM-DD') AS pinjam,
              to_char(l.tanggal_jatuh_tempo, 'YYYY-MM-DD') AS jatuh_tempo,
              d.hari_terlambat, d.denda_hitung, l.status_perpanjangan, l.jumlah_perpanjangan
         FROM loans l
         JOIN users u ON u.id = l.user_id
         JOIN books b ON b.id = l.book_id
         JOIN v_loans_denda d ON d.loan_id = l.id
        WHERE l.status = 'Sedang Dipinjam' AND ${SEARCH}
        ORDER BY l.tanggal_jatuh_tempo ASC, l.id ASC`,
      [pattern]
    ));
  } else if (tab === "perpanjangan") {
    ({ rows } = await query(
      `SELECT l.id, u.nama, u.nomor_identitas AS nim, b.judul, l.jumlah_perpanjangan,
              to_char(l.tanggal_jatuh_tempo, 'YYYY-MM-DD') AS jatuh_tempo,
              to_char(l.tanggal_jatuh_tempo + b.durasi_maks_pinjam, 'YYYY-MM-DD') AS jatuh_tempo_baru,
              b.durasi_maks_pinjam
         FROM loans l JOIN users u ON u.id = l.user_id JOIN books b ON b.id = l.book_id
        WHERE l.status = 'Sedang Dipinjam' AND l.status_perpanjangan = 'Perpanjangan Diajukan' AND ${SEARCH}
        ORDER BY l.tanggal_jatuh_tempo ASC, l.id ASC`,
      [pattern]
    ));
  } else if (tab === "denda") {
    ({ rows } = await query(
      `SELECT l.id, u.nama, u.nomor_identitas AS nim, b.judul, l.denda_nominal,
              (l.tanggal_kembali - l.tanggal_jatuh_tempo) AS hari_terlambat,
              to_char(l.tanggal_kembali, 'YYYY-MM-DD') AS kembali
         FROM loans l JOIN users u ON u.id = l.user_id JOIN books b ON b.id = l.book_id
        WHERE l.status = 'Selesai' AND l.status_denda = 'Tertunggak' AND ${SEARCH}
        ORDER BY l.tanggal_kembali ASC, l.id ASC`,
      [pattern]
    ));
  } else {
    ({ rows } = await query(
      `SELECT l.id, u.nama, u.nomor_identitas AS nim, b.judul, l.status, l.alasan_penolakan,
              l.denda_nominal, l.status_denda,
              to_char(l.tanggal_pinjam, 'YYYY-MM-DD') AS pinjam,
              to_char(l.tanggal_kembali, 'YYYY-MM-DD') AS kembali
         FROM loans l JOIN users u ON u.id = l.user_id JOIN books b ON b.id = l.book_id
        WHERE l.status IN ('Selesai', 'Ditolak') AND ${SEARCH}
        ORDER BY COALESCE(l.tanggal_kembali, l.tanggal_pengajuan::date) DESC, l.id DESC
        LIMIT 100`,
      [pattern]
    ));
  }

  const tabHref = (key) => `/pegawai/loans?tab=${key}`;

  return (
    <>
      <Flash ok={sp.ok} err={sp.err} messages={MESSAGES} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-sm" role="tablist" aria-label="Tab peminjaman">
          {TABS.map((t) => {
            const n = t.key === "riwayat" ? null : counts[0][t.key];
            return (
              <Link
                key={t.key}
                href={tabHref(t.key)}
                role="tab"
                aria-selected={tab === t.key}
                className={"rounded-full border px-3 py-1 " + (tab === t.key ? "border-amber-800 bg-amber-800 text-white" : "border-stone-300 text-stone-700 hover:bg-stone-100")}
              >
                {t.label}
                {n !== null ? ` (${n})` : ""}
              </Link>
            );
          })}
        </div>
        <form method="get" className="flex gap-2">
          <input type="hidden" name="tab" value={tab} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari nama, NIM, atau judul"
            aria-label="Cari transaksi"
            className="w-60 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-700"
          />
          <button className="rounded-lg border border-stone-300 px-3 py-2 text-sm hover:bg-stone-100">Cari</button>
        </form>
      </div>

      {tab === "antrean" && (
        <Table head={["Mahasiswa", "Buku", "Diajukan", "Stok", "Aksi"]} colSpan={5} isEmpty={rows.length === 0} empty="Tidak ada pengajuan yang menunggu.">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className={td}><Person nama={r.nama} nim={r.nim} /></td>
              <td className={td}>{r.judul}</td>
              <td className={td}>{formatTanggalWaktu(r.diajukan)}</td>
              <td className={td + (r.stok_tersedia <= 0 ? " text-red-700" : "")}>{r.stok_tersedia}</td>
              <td className={td}>
                <div className="flex flex-wrap items-start gap-3">
                  <form action={approveLoanAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-lg bg-green-700 px-3 py-1.5 text-sm font-medium text-white hover:brightness-110">Approve</button>
                  </form>
                  <form action={rejectLoanAction} className="flex gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    <input name="alasan" placeholder="Alasan penolakan" aria-label={`Alasan menolak pengajuan ${r.nama}`} maxLength={300} className="w-44 rounded-lg border border-stone-300 px-2 py-1.5 text-sm outline-none focus:border-red-600" />
                    <button className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50">Reject</button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {tab === "dipinjam" && (
        <Table head={["Mahasiswa", "Buku", "Dipinjam", "Jatuh tempo", "Perpanjangan", "Keterlambatan", "Aksi"]} colSpan={7} isEmpty={rows.length === 0} empty="Tidak ada buku yang sedang dipinjam.">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className={td}><Person nama={r.nama} nim={r.nim} /></td>
              <td className={td}>{r.judul}</td>
              <td className={td}>{formatTanggal(r.pinjam)}</td>
              <td className={td}>{formatTanggal(r.jatuh_tempo)}</td>
              <td className={td + " text-stone-600"}>
                {r.status_perpanjangan === "Tidak Ada" ? "-" : r.status_perpanjangan.replace("Perpanjangan ", "")}
                {r.jumlah_perpanjangan > 0 && <div className="text-xs">{r.jumlah_perpanjangan}x diperpanjang</div>}
              </td>
              <td className={td}>
                {r.hari_terlambat > 0 ? (
                  <span className="font-medium text-red-700">
                    {r.hari_terlambat} hari
                    <div className="text-xs">denda berjalan {formatRupiah(r.denda_hitung)}</div>
                  </span>
                ) : (
                  <span className="text-stone-500">Tepat waktu</span>
                )}
              </td>
              <td className={td}>
                <ConfirmForm
                  action={returnLoanAction}
                  id={r.id}
                  label="Konfirmasi Pengembalian"
                  confirmText={`Konfirmasi pengembalian "${r.judul}" oleh ${r.nama}?`}
                  className="rounded-lg bg-amber-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-900"
                />
              </td>
            </tr>
          ))}
        </Table>
      )}

      {tab === "perpanjangan" && (
        <Table head={["Mahasiswa", "Buku", "Jatuh tempo saat ini", "Perpanjangan ke-", "Jatuh tempo baru", "Aksi"]} colSpan={6} isEmpty={rows.length === 0} empty="Tidak ada pengajuan perpanjangan.">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className={td}><Person nama={r.nama} nim={r.nim} /></td>
              <td className={td}>{r.judul}</td>
              <td className={td}>{formatTanggal(r.jatuh_tempo)}</td>
              <td className={td}>{r.jumlah_perpanjangan + 1}</td>
              <td className={td}>
                {formatTanggal(r.jatuh_tempo_baru)}
                <div className="text-xs text-stone-500">+{r.durasi_maks_pinjam} hari</div>
              </td>
              <td className={td}>
                <div className="flex flex-wrap gap-2">
                  <form action={approveExtensionAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-lg bg-green-700 px-3 py-1.5 text-sm font-medium text-white hover:brightness-110">Setujui</button>
                  </form>
                  <form action={rejectExtensionAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50">Tolak</button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {tab === "denda" && (
        <Table head={["Mahasiswa", "Buku", "Dikembalikan", "Terlambat", "Denda", "Aksi"]} colSpan={6} isEmpty={rows.length === 0} empty="Tidak ada denda tertunggak.">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className={td}><Person nama={r.nama} nim={r.nim} /></td>
              <td className={td}>{r.judul}</td>
              <td className={td}>{formatTanggal(r.kembali)}</td>
              <td className={td}>{r.hari_terlambat} hari</td>
              <td className={td + " font-medium text-red-700"}>{formatRupiah(r.denda_nominal)}</td>
              <td className={td}>
                <ConfirmForm
                  action={markFinePaidAction}
                  id={r.id}
                  label="Tandai Lunas"
                  confirmText={`Catat denda ${formatRupiah(r.denda_nominal)} dari ${r.nama} sebagai lunas?`}
                  className="rounded-lg bg-green-700 px-3 py-1.5 text-sm font-medium text-white hover:brightness-110"
                />
              </td>
            </tr>
          ))}
        </Table>
      )}

      {tab === "riwayat" && (
        <Table head={["Mahasiswa", "Buku", "Status", "Dipinjam", "Dikembalikan", "Denda", "Keterangan"]} colSpan={7} isEmpty={rows.length === 0} empty="Belum ada riwayat transaksi.">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className={td}><Person nama={r.nama} nim={r.nim} /></td>
              <td className={td}>{r.judul}</td>
              <td className={td}><StatusBadge status={r.status} /></td>
              <td className={td}>{r.pinjam ? formatTanggal(r.pinjam) : "-"}</td>
              <td className={td}>{r.kembali ? formatTanggal(r.kembali) : "-"}</td>
              <td className={td}>
                {r.denda_nominal > 0 ? (
                  <span className={r.status_denda === "Tertunggak" ? "font-medium text-red-700" : "text-green-700"}>
                    {formatRupiah(r.denda_nominal)}
                    <div className="text-xs">{r.status_denda}</div>
                  </span>
                ) : (
                  "-"
                )}
              </td>
              <td className={td + " text-stone-600"}>{r.alasan_penolakan ?? ""}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}

export default function LoansPage({ searchParams }) {
  return (
    <StaffShell title="Peminjaman">
      <LoanDesk searchParams={searchParams} />
    </StaffShell>
  );
}
