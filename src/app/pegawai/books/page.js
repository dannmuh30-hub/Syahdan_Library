import Link from "next/link";
import StaffShell from "@/components/StaffShell";
import DeleteForm from "@/components/DeleteForm";
import Flash from "@/components/Flash";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { deleteBookAction } from "@/app/actions/books";

export const metadata = { title: "Manajemen Buku" };

const MESSAGES = {
  ok: { created: "Buku berhasil ditambahkan.", updated: "Buku berhasil diperbarui.", deleted: "Buku berhasil dihapus." },
  err: {
    active: "Buku tidak dapat dihapus karena sedang dipinjam atau memiliki pengajuan yang menunggu.",
    history: "Buku tidak dapat dihapus karena memiliki riwayat peminjaman.",
    notfound: "Buku tidak ditemukan.",
    adminonly: "Menambah dan menghapus buku hanya dapat dilakukan oleh Admin.",
  },
};

async function BookList({ searchParams }) {
  const user = await requireRole("pegawai", "admin");
  const isAdmin = user.role === "admin";
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const pattern = q ? `%${q.replace(/[\\%_]/g, "\\$&")}%` : null;
  const { rows: books } = await query(
    `SELECT b.id, b.judul, b.isbn, b.pengarang, b.tahun_terbit, b.stok_total, b.stok_tersedia, c.nama AS kategori
       FROM books b
       JOIN categories c ON c.id = b.category_id
      WHERE ($1::text IS NULL OR b.judul ILIKE $1 OR b.pengarang ILIKE $1 OR b.isbn ILIKE $1)
      ORDER BY b.judul`,
    [pattern]
  );

  return (
    <>
      <Flash ok={sp.ok} err={sp.err} messages={MESSAGES} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <form method="get" className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari judul, pengarang, ISBN"
            aria-label="Cari buku"
            className="w-64 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-700"
          />
          <button className="rounded-lg border border-stone-300 px-3 py-2 text-sm hover:bg-stone-100">Cari</button>
        </form>
        {isAdmin ? (
          <Link href="/pegawai/books/new" className="rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900">
            Tambah Buku
          </Link>
        ) : (
          <p className="text-xs text-stone-500">Menambah dan menghapus buku hanya dapat dilakukan oleh Admin.</p>
        )}
      </div>
      <div className="overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-2 font-medium">Judul</th>
              <th className="px-4 py-2 font-medium">Pengarang</th>
              <th className="px-4 py-2 font-medium">Kategori</th>
              <th className="px-4 py-2 font-medium">Tahun</th>
              <th className="px-4 py-2 font-medium">Stok total</th>
              <th className="px-4 py-2 font-medium">Tersedia</th>
              <th className="px-4 py-2 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {books.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-stone-500">
                  {q ? "Tidak ada buku yang cocok." : "Belum ada buku."}
                </td>
              </tr>
            )}
            {books.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-2">
                  {b.judul}
                  <div className="text-xs text-stone-500">{b.isbn}</div>
                </td>
                <td className="px-4 py-2">{b.pengarang}</td>
                <td className="px-4 py-2">{b.kategori}</td>
                <td className="px-4 py-2">{b.tahun_terbit}</td>
                <td className="px-4 py-2">{b.stok_total}</td>
                <td className="px-4 py-2">{b.stok_tersedia}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-4">
                    <Link href={`/pegawai/books/${b.id}/edit`} className="text-sm font-medium text-amber-800 hover:underline">
                      Edit
                    </Link>
                    {isAdmin && <DeleteForm action={deleteBookAction} id={b.id} confirmText={`Hapus buku "${b.judul}"?`} />}
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

export default function BooksPage({ searchParams }) {
  return (
    <StaffShell title="Manajemen Buku">
      <BookList searchParams={searchParams} />
    </StaffShell>
  );
}
