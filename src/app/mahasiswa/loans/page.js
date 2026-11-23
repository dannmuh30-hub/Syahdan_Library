import Link from "next/link";
import MahasiswaShell from "@/components/MahasiswaShell";
import StatusBadge from "@/components/StatusBadge";
import Flash from "@/components/Flash";
import { query } from "@/lib/db";
import { requestExtensionAction } from "@/app/actions/loans";
import { MAX_PERPANJANGAN } from "@/lib/rules";
import { formatRupiah, formatTanggal, formatTanggalWaktu } from "@/lib/format";

export const metadata = { title: "Peminjaman Saya" };

const MESSAGES = {
  ok: {
    ext_requested: "Pengajuan perpanjangan terkirim. Menunggu persetujuan pegawai.",
    reviewed: "Terima kasih, ulasanmu tersimpan.",
  },
  err: {
    notfound: "Data peminjaman tidak ditemukan.",
    ext_state: "Perpanjangan hanya bisa diajukan untuk buku yang sedang dipinjam.",
    ext_pending: "Pengajuan perpanjangan sebelumnya masih menunggu persetujuan.",
    ext_max: `Perpanjangan sudah mencapai batas maksimal (${MAX_PERPANJANGAN} kali).`,
    ext_overdue: "Perpanjangan tidak bisa diajukan setelah melewati jatuh tempo. Segera kembalikan buku.",
    reviewed: "Kamu sudah memberi ulasan untuk buku ini.",
  },
};

function Row({ label, children }) {
  return (
    <div className="flex gap-2 text-sm">
      <dt className="w-32 shrink-0 text-stone-500">{label}</dt>
      <dd className="text-stone-900">{children}</dd>
    </div>
  );
}

function ExtensionControl({ l }) {
  let alasan = null;
  if (l.status_perpanjangan === "Perpanjangan Diajukan") alasan = "Pengajuan perpanjangan menunggu persetujuan pegawai.";
  else if (l.jumlah_perpanjangan >= MAX_PERPANJANGAN) alasan = `Batas perpanjangan (${MAX_PERPANJANGAN} kali) sudah tercapai.`;
  else if (l.hari_terlambat > 0) alasan = "Sudah lewat jatuh tempo, perpanjangan tidak tersedia.";
  if (alasan) return <p className="mt-3 text-sm text-stone-500">{alasan}</p>;
  return (
    <form action={requestExtensionAction} className="mt-3">
      <input type="hidden" name="id" value={l.id} />
      <button className="rounded-lg border border-amber-800 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-50">
        Ajukan Perpanjangan
      </button>
    </form>
  );
}

function LoanCard({ l }) {
  const aktif = l.status === "Sedang Dipinjam";
  return (
    <li className="rounded-xl border border-stone-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Link href={`/buku/${l.book_id}`} className="font-semibold text-stone-900 hover:underline">
          {l.judul}
        </Link>
        <StatusBadge status={l.status} />
      </div>
      <dl className="mt-2 space-y-1">
        <Row label="Diajukan">{formatTanggalWaktu(l.diajukan)}</Row>
        {l.pinjam && <Row label="Tanggal pinjam">{formatTanggal(l.pinjam)}</Row>}
        {l.jatuh_tempo && <Row label="Jatuh tempo">{formatTanggal(l.jatuh_tempo)}</Row>}
        {l.kembali && <Row label="Dikembalikan">{formatTanggal(l.kembali)}</Row>}
        {l.status === "Ditolak" && <Row label="Alasan penolakan">{l.alasan_penolakan}</Row>}
        {aktif && l.hari_terlambat > 0 && (
          <Row label="Keterlambatan">
            <span className="font-medium text-red-700">
              {l.hari_terlambat} hari, denda berjalan {formatRupiah(l.denda_hitung)}
            </span>
          </Row>
        )}
        {l.denda_nominal > 0 && (
          <Row label="Denda">
            <span className={l.status_denda === "Tertunggak" ? "font-medium text-red-700" : "text-green-700"}>
              {formatRupiah(l.denda_nominal)} ({l.status_denda})
            </span>
          </Row>
        )}
        {aktif && l.status_perpanjangan !== "Tidak Ada" && (
          <Row label="Perpanjangan">
            {l.status_perpanjangan.replace("Perpanjangan ", "")}
            {l.jumlah_perpanjangan > 0 && ` (${l.jumlah_perpanjangan}x diperpanjang)`}
          </Row>
        )}
      </dl>
      {aktif && <ExtensionControl l={l} />}
      {l.status === "Selesai" && (
        <div className="mt-3 text-sm">
          {l.rating ? (
            <p className="text-stone-600">
              Ulasan kamu: <span className="text-amber-600">{"★".repeat(l.rating)}</span>
              <span className="text-stone-300">{"★".repeat(5 - l.rating)}</span>
            </p>
          ) : (
            <Link href={`/mahasiswa/loans/${l.id}/review`} className="font-medium text-amber-800 hover:underline">
              Tulis ulasan
            </Link>
          )}
        </div>
      )}
    </li>
  );
}

async function MyLoans({ user, searchParams }) {
  const sp = await searchParams;
  const { rows } = await query(
    `SELECT l.id, l.book_id, b.judul, l.status, l.alasan_penolakan, l.denda_nominal, l.status_denda,
            to_char(l.tanggal_pengajuan, 'YYYY-MM-DD HH24:MI') AS diajukan,
            to_char(l.tanggal_pinjam, 'YYYY-MM-DD') AS pinjam,
            to_char(l.tanggal_jatuh_tempo, 'YYYY-MM-DD') AS jatuh_tempo,
            to_char(l.tanggal_kembali, 'YYYY-MM-DD') AS kembali,
            d.hari_terlambat, d.denda_hitung, l.status_perpanjangan, l.jumlah_perpanjangan, rv.rating
       FROM loans l
       JOIN books b ON b.id = l.book_id
       JOIN v_loans_denda d ON d.loan_id = l.id
       LEFT JOIN reviews rv ON rv.user_id = l.user_id AND rv.book_id = l.book_id
      WHERE l.user_id = $1
      ORDER BY l.tanggal_pengajuan DESC, l.id DESC`,
    [user.id]
  );
  const aktif = rows.filter((r) => r.status === "Menunggu Konfirmasi" || r.status === "Sedang Dipinjam");
  const riwayat = rows.filter((r) => r.status === "Selesai" || r.status === "Ditolak");

  return (
    <>
      <Flash ok={sp.ok} err={sp.err} messages={MESSAGES} />
      <section aria-labelledby="aktif">
        <h2 id="aktif" className="mb-3 text-lg font-semibold text-stone-900">Aktif</h2>
        {aktif.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
            Tidak ada pengajuan atau peminjaman aktif. <Link href="/katalog" className="font-medium text-amber-800 hover:underline">Jelajahi katalog</Link>
          </p>
        ) : (
          <ul className="space-y-3">{aktif.map((l) => <LoanCard key={l.id} l={l} />)}</ul>
        )}
      </section>
      <section aria-labelledby="riwayat" className="mt-8">
        <h2 id="riwayat" className="mb-3 text-lg font-semibold text-stone-900">Riwayat</h2>
        {riwayat.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">Belum ada riwayat.</p>
        ) : (
          <ul className="space-y-3">{riwayat.map((l) => <LoanCard key={l.id} l={l} />)}</ul>
        )}
      </section>
    </>
  );
}

export default function MyLoansPage({ searchParams }) {
  return (
    <MahasiswaShell title="Peminjaman Saya">
      {(user) => <MyLoans user={user} searchParams={searchParams} />}
    </MahasiswaShell>
  );
}
