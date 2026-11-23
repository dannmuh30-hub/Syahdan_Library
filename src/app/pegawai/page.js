import Link from "next/link";
import StaffShell from "@/components/StaffShell";
import StatCard from "@/components/StatCard";
import { query } from "@/lib/db";
import { formatTanggalWaktu } from "@/lib/format";

export const metadata = { title: "Dashboard Pegawai" };

const SHORTCUTS = [
  { href: "/pegawai/loans", title: "Meja Peminjaman", desc: "Antrean, perpanjangan, pengembalian, dan denda." },
  { href: "/pegawai/books", title: "Kelola Buku", desc: "Ubah data dan atur stok koleksi." },
  { href: "/pegawai/announcements", title: "Kelola Pengumuman", desc: "Draft dan publikasi informasi perpustakaan." },
];

async function Dashboard() {
  const [{ rows: s }, { rows: antrean }] = await Promise.all([
    query(
      `SELECT (SELECT COUNT(*) FROM loans WHERE status = 'Menunggu Konfirmasi')::int AS antrean,
              (SELECT COUNT(*) FROM loans WHERE status = 'Sedang Dipinjam' AND status_perpanjangan = 'Perpanjangan Diajukan')::int AS perpanjangan,
              (SELECT COUNT(*) FROM v_loans_denda WHERE status = 'Sedang Dipinjam' AND hari_terlambat > 0)::int AS terlambat,
              (SELECT COUNT(*) FROM loans WHERE status = 'Selesai' AND status_denda = 'Tertunggak')::int AS denda,
              (SELECT COUNT(*) FROM books WHERE stok_tersedia = 0)::int AS stok_habis,
              (SELECT COUNT(*) FROM loans WHERE status = 'Sedang Dipinjam')::int AS dipinjam`
    ),
    query(
      `SELECT l.id, u.nama, b.judul, b.stok_tersedia, to_char(l.tanggal_pengajuan, 'YYYY-MM-DD HH24:MI') AS diajukan
         FROM loans l JOIN users u ON u.id = l.user_id JOIN books b ON b.id = l.book_id
        WHERE l.status = 'Menunggu Konfirmasi' ORDER BY l.tanggal_pengajuan ASC, l.id ASC LIMIT 5`
    ),
  ]);
  const c = s[0];
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Antrean" value={c.antrean} href="/pegawai/loans" tone={c.antrean > 0 ? "attn" : "default"} />
        <StatCard label="Perpanjangan" value={c.perpanjangan} href="/pegawai/loans?tab=perpanjangan" tone={c.perpanjangan > 0 ? "attn" : "default"} />
        <StatCard label="Sedang dipinjam" value={c.dipinjam} href="/pegawai/loans?tab=dipinjam" />
        <StatCard label="Terlambat" value={c.terlambat} href="/pegawai/loans?tab=dipinjam" tone={c.terlambat > 0 ? "warn" : "default"} />
        <StatCard label="Denda tertunggak" value={c.denda} href="/pegawai/loans?tab=denda" tone={c.denda > 0 ? "warn" : "default"} />
        <StatCard label="Stok habis" value={c.stok_habis} href="/pegawai/books" hint="judul buku" />
      </div>

      <section aria-labelledby="antrean" className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="antrean" className="text-lg font-semibold text-stone-900">Antrean terlama</h2>
          <Link href="/pegawai/loans" className="text-sm text-amber-800 hover:underline">Buka meja peminjaman</Link>
        </div>
        {antrean.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">Tidak ada pengajuan yang menunggu.</p>
        ) : (
          <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200">
            {antrean.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <span><span className="font-medium text-stone-900">{r.nama}</span> mengajukan <span className="font-medium">{r.judul}</span></span>
                <span className="text-stone-500">
                  {formatTanggalWaktu(r.diajukan)}
                  {r.stok_tersedia === 0 && <span className="ml-2 font-medium text-red-700">stok habis</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {SHORTCUTS.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-xl border border-stone-200 p-5 hover:border-amber-800 hover:bg-amber-50">
            <h2 className="font-semibold text-stone-900">{l.title}</h2>
            <p className="mt-1 text-sm text-stone-600">{l.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function PegawaiPage() {
  return (
    <StaffShell title="Dashboard Pegawai">
      <Dashboard />
    </StaffShell>
  );
}
