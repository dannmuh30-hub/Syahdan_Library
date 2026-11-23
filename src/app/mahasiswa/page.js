import Link from "next/link";
import MahasiswaShell from "@/components/MahasiswaShell";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { requestExtensionAction } from "@/app/actions/loans";
import { MAX_PERPANJANGAN } from "@/lib/rules";
import { formatRupiah, formatTanggal } from "@/lib/format";

export const metadata = { title: "Dashboard Mahasiswa" };

async function Dashboard({ user }) {
  const [{ rows: aktif }, { rows: riwayat }, { rows: sum }] = await Promise.all([
    query(
      `SELECT l.id, l.book_id, b.judul, l.status, l.status_perpanjangan, l.jumlah_perpanjangan,
              to_char(l.tanggal_jatuh_tempo, 'YYYY-MM-DD') AS jatuh_tempo, d.hari_terlambat, d.denda_hitung
         FROM loans l JOIN books b ON b.id = l.book_id JOIN v_loans_denda d ON d.loan_id = l.id
        WHERE l.user_id = $1 AND l.status IN ('Menunggu Konfirmasi','Sedang Dipinjam')
        ORDER BY l.tanggal_jatuh_tempo ASC NULLS LAST, l.id DESC`,
      [user.id]
    ),
    query(
      `SELECT l.id, l.book_id, b.judul, l.status, l.denda_nominal, l.status_denda,
              to_char(COALESCE(l.tanggal_kembali, l.tanggal_pengajuan::date), 'YYYY-MM-DD') AS tgl, rv.rating
         FROM loans l JOIN books b ON b.id = l.book_id
         LEFT JOIN reviews rv ON rv.user_id = l.user_id AND rv.book_id = l.book_id
        WHERE l.user_id = $1 AND l.status IN ('Selesai','Ditolak')
        ORDER BY l.tanggal_pengajuan DESC, l.id DESC LIMIT 5`,
      [user.id]
    ),
    query(
      `SELECT COALESCE(SUM(denda_nominal) FILTER (WHERE status_denda = 'Tertunggak'), 0)::int AS tunggakan,
              COUNT(*) FILTER (WHERE status = 'Selesai')::int AS selesai
         FROM loans WHERE user_id = $1`,
      [user.id]
    ),
  ]);
  const dipinjam = aktif.filter((l) => l.status === "Sedang Dipinjam");
  const menunggu = aktif.length - dipinjam.length;
  const terlambat = dipinjam.filter((l) => l.hari_terlambat > 0);
  const tunggakan = sum[0].tunggakan;

  return (
    <>
      {tunggakan > 0 && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          Kamu memiliki denda tertunggak <strong>{formatRupiah(tunggakan)}</strong>. Pengajuan pinjam baru diblokir sampai denda
          dilunasi di meja Pegawai.
        </p>
      )}
      {terlambat.length > 0 && (
        <p role="alert" className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-200">
          {terlambat.length} buku melewati jatuh tempo. Segera kembalikan agar denda tidak bertambah.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Sedang dipinjam" value={dipinjam.length} href="/mahasiswa/loans" />
        <StatCard label="Menunggu konfirmasi" value={menunggu} href="/mahasiswa/loans" />
        <StatCard label="Buku selesai dibaca" value={sum[0].selesai} />
        <StatCard label="Denda tertunggak" value={formatRupiah(tunggakan)} tone={tunggakan > 0 ? "warn" : "default"} />
      </div>

      <section aria-labelledby="aktif" className="mt-8">
        <h2 id="aktif" className="mb-3 text-lg font-semibold text-stone-900">Peminjaman aktif</h2>
        {aktif.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
            Belum ada peminjaman aktif. <Link href="/katalog" className="font-medium text-amber-800 hover:underline">Jelajahi katalog</Link>
          </p>
        ) : (
          <ul className="space-y-3">
            {aktif.map((l) => {
              const bisa =
                l.status === "Sedang Dipinjam" &&
                l.status_perpanjangan !== "Perpanjangan Diajukan" &&
                l.jumlah_perpanjangan < MAX_PERPANJANGAN &&
                l.hari_terlambat === 0;
              return (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 p-4">
                  <div>
                    <Link href={`/buku/${l.book_id}`} className="font-semibold text-stone-900 hover:underline">{l.judul}</Link>
                    <p className="mt-0.5 text-sm text-stone-600">
                      {l.status === "Menunggu Konfirmasi" ? (
                        "Menunggu persetujuan pegawai"
                      ) : l.hari_terlambat > 0 ? (
                        <span className="font-medium text-red-700">
                          Terlambat {l.hari_terlambat} hari, denda berjalan {formatRupiah(l.denda_hitung)}
                        </span>
                      ) : (
                        `Jatuh tempo ${formatTanggal(l.jatuh_tempo)}`
                      )}
                      {l.status_perpanjangan === "Perpanjangan Diajukan" && " · perpanjangan menunggu persetujuan"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={l.status} />
                    {bisa && (
                      <form action={requestExtensionAction}>
                        <input type="hidden" name="id" value={l.id} />
                        <button className="rounded-lg border border-amber-800 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-50">
                          Perpanjang
                        </button>
                      </form>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="riwayat" className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="riwayat" className="text-lg font-semibold text-stone-900">Riwayat terbaru</h2>
          <Link href="/mahasiswa/loans" className="text-sm text-amber-800 hover:underline">Lihat semua</Link>
        </div>
        {riwayat.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">Belum ada riwayat.</p>
        ) : (
          <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200">
            {riwayat.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <span className="font-medium text-stone-900">{l.judul}</span>
                  <span className="ml-2 text-stone-500">{formatTanggal(l.tgl)}</span>
                  {l.denda_nominal > 0 && (
                    <span className={"ml-2 " + (l.status_denda === "Tertunggak" ? "text-red-700" : "text-green-700")}>
                      Denda {formatRupiah(l.denda_nominal)} ({l.status_denda})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={l.status} />
                  {l.status === "Selesai" &&
                    (l.rating ? (
                      <span className="text-amber-600" aria-label={`Rating ${l.rating} dari 5`}>{"★".repeat(l.rating)}</span>
                    ) : (
                      <Link href={`/mahasiswa/loans/${l.id}/review`} className="font-medium text-amber-800 hover:underline">Tulis ulasan</Link>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default function MahasiswaPage() {
  return <MahasiswaShell title="Dashboard Mahasiswa">{(user) => <Dashboard user={user} />}</MahasiswaShell>;
}
