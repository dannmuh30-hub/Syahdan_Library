import Link from "next/link";
import StaffShell from "@/components/StaffShell";
import DeleteForm from "@/components/DeleteForm";
import Flash from "@/components/Flash";
import { query } from "@/lib/db";
import { deleteAnnouncementAction } from "@/app/actions/announcements";
import { formatTanggal } from "@/lib/format";

export const metadata = { title: "Manajemen Pengumuman" };

const MESSAGES = {
  ok: { created: "Pengumuman berhasil ditambahkan.", updated: "Pengumuman berhasil diperbarui.", deleted: "Pengumuman berhasil dihapus." },
  err: { notfound: "Pengumuman tidak ditemukan." },
};

async function AnnouncementList({ searchParams }) {
  const sp = await searchParams;
  const status = sp.status === "Draft" || sp.status === "Published" ? sp.status : null;
  const { rows } = await query(
    `SELECT id, judul, kategori, status, to_char(tanggal_rilis, 'YYYY-MM-DD') AS tanggal_iso
       FROM announcements
      WHERE ($1::text IS NULL OR status = $1)
      ORDER BY tanggal_rilis DESC, id DESC`,
    [status]
  );
  return (
    <>
      <Flash ok={sp.ok} err={sp.err} messages={MESSAGES} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-sm" aria-label="Filter status">
          {[null, "Published", "Draft"].map((s) => (
            <Link
              key={s ?? "semua"}
              href={s ? `/pegawai/announcements?status=${s}` : "/pegawai/announcements"}
              className={
                "rounded-full border px-3 py-1 " +
                (status === s ? "border-amber-800 bg-amber-800 text-white" : "border-stone-300 text-stone-700 hover:bg-stone-100")
              }
            >
              {s ?? "Semua"}
            </Link>
          ))}
        </div>
        <Link href="/pegawai/announcements/new" className="rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900">
          Tambah Pengumuman
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-2 font-medium">Judul</th>
              <th className="px-4 py-2 font-medium">Kategori</th>
              <th className="px-4 py-2 font-medium">Tanggal rilis</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-stone-500">
                  Belum ada pengumuman.
                </td>
              </tr>
            )}
            {rows.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-2">
                  <Link href={`/pengumuman/${a.id}`} className="hover:underline">
                    {a.judul}
                  </Link>
                </td>
                <td className="px-4 py-2">{a.kategori}</td>
                <td className="px-4 py-2">{formatTanggal(a.tanggal_iso)}</td>
                <td className="px-4 py-2">
                  <span className={a.status === "Published" ? "text-green-700" : "text-stone-500"}>{a.status}</span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-4">
                    <Link href={`/pegawai/announcements/${a.id}/edit`} className="text-sm font-medium text-amber-800 hover:underline">
                      Edit
                    </Link>
                    <DeleteForm action={deleteAnnouncementAction} id={a.id} confirmText={`Hapus pengumuman "${a.judul}"?`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function AnnouncementsPage({ searchParams }) {
  return (
    <StaffShell title="Manajemen Pengumuman">
      <AnnouncementList searchParams={searchParams} />
    </StaffShell>
  );
}
