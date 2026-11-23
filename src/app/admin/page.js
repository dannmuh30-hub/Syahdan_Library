import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { formatRupiah, formatTanggalWaktu } from "@/lib/format";

export const metadata = { title: "Dashboard Admin" };

const LINKS = [
  { href: "/admin/users", title: "Manajemen User", desc: "Kelola akun Admin, Pegawai, dan Mahasiswa." },
  { href: "/admin/categories", title: "Manajemen Kategori", desc: "Kelola master data kategori buku." },
  { href: "/admin/requests", title: "Request Buku", desc: "Tinjau usulan buku dari Mahasiswa." },
  { href: "/admin/transactions", title: "Monitoring Transaksi", desc: "Pantau seluruh peminjaman dan denda." },
  { href: "/pegawai/loans", title: "Meja Peminjaman", desc: "Proses antrean, pengembalian, dan denda." },
  { href: "/pegawai/books", title: "Kelola Buku", desc: "Koleksi dan stok." },
  { href: "/pegawai/announcements", title: "Kelola Pengumuman", desc: "Draft dan publikasi." },
];

async function Dashboard() {
  const [{ rows: s }, { rows: recent }] = await Promise.all([
    query(
      `SELECT (SELECT COUNT(*) FROM users WHERE role = 'mahasiswa')::int AS mahasiswa,
              (SELECT COUNT(*) FROM users WHERE role = 'pegawai')::int AS pegawai,
              (SELECT COUNT(*) FROM users WHERE role = 'admin')::int AS admin,
              (SELECT COUNT(*) FROM books)::int AS judul,
              (SELECT COALESCE(SUM(stok_total), 0) FROM books)::int AS eksemplar,
              (SELECT COUNT(*) FROM categories)::int AS kategori,
              (SELECT COUNT(*) FROM loans)::int AS transaksi,
              (SELECT COUNT(*) FROM book_requests WHERE status = 'Menunggu')::int AS req_menunggu,
              (SELECT COUNT(*) FROM loans WHERE status = 'Menunggu Konfirmasi')::int AS menunggu,
              (SELECT COUNT(*) FROM loans WHERE status = 'Sedang Dipinjam')::int AS dipinjam,
              (SELECT COUNT(*) FROM loans WHERE status = 'Selesai')::int AS selesai,
              (SELECT COUNT(*) FROM loans WHERE status = 'Ditolak')::int AS ditolak,
              (SELECT COALESCE(SUM(denda_nominal), 0) FROM loans WHERE status_denda = 'Tertunggak')::int AS denda_tunggak,
              (SELECT COALESCE(SUM(denda_nominal), 0) FROM loans WHERE status_denda = 'Lunas')::int AS denda_lunas`
    ),
    query(
      `SELECT l.id, u.nama, b.judul, l.status, to_char(l.tanggal_pengajuan, 'YYYY-MM-DD HH24:MI') AS diajukan
         FROM loans l JOIN users u ON u.id = l.user_id JOIN books b ON b.id = l.book_id
        ORDER BY l.tanggal_pengajuan DESC, l.id DESC LIMIT 6`
    ),
  ]);
  const c = s[0];
  return (
    <>
      <h2 className="mb-3 text-lg font-semibold text-stone-900">Ringkasan sistem</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Mahasiswa" value={c.mahasiswa} href="/admin/users" hint={`${c.pegawai} pegawai, ${c.admin} admin`} />
        <StatCard label="Judul buku" value={c.judul} href="/pegawai/books" hint={`${c.eksemplar} eksemplar`} />
        <StatCard label="Kategori" value={c.kategori} href="/admin/categories" />
        <StatCard label="Total transaksi" value={c.transaksi} href="/admin/transactions" />
        <StatCard label="Request buku menunggu" value={c.req_menunggu} href="/admin/requests" tone={c.req_menunggu > 0 ? "attn" : "default"} />
        <StatCard label="Menunggu konfirmasi" value={c.menunggu} href="/admin/transactions?status=Menunggu+Konfirmasi" />
        <StatCard label="Sedang dipinjam" value={c.dipinjam} href="/admin/transactions?status=Sedang+Dipinjam" />
        <StatCard label="Selesai" value={c.selesai} href="/admin/transactions?status=Selesai" hint={`${c.ditolak} ditolak`} />
        <StatCard label="Denda" value={formatRupiah(c.denda_tunggak)} tone={c.denda_tunggak > 0 ? "warn" : "default"} hint={`tertunggak · ${formatRupiah(c.denda_lunas)} lunas`} />
      </div>

      <section aria-labelledby="terbaru" className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="terbaru" className="text-lg font-semibold text-stone-900">Transaksi terbaru</h2>
          <Link href="/admin/transactions" className="text-sm text-amber-800 hover:underline">Lihat semua</Link>
        </div>
        <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200">
          {recent.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <span><span className="font-medium text-stone-900">{r.nama}</span> · {r.judul}</span>
              <span className="flex items-center gap-3 text-stone-500">{formatTanggalWaktu(r.diajukan)} <StatusBadge status={r.status} /></span>
            </li>
          ))}
        </ul>
      </section>

      <h2 className="mb-3 mt-8 text-lg font-semibold text-stone-900">Menu</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-xl border border-stone-200 p-5 hover:border-amber-800 hover:bg-amber-50">
            <h3 className="font-semibold text-stone-900">{l.title}</h3>
            <p className="mt-1 text-sm text-stone-600">{l.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function AdminPage() {
  return (
    <AdminShell title="Dashboard Admin">
      <Dashboard />
    </AdminShell>
  );
}
