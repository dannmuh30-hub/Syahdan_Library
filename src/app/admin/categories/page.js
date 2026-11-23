import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import DeleteForm from "@/components/DeleteForm";
import Flash from "@/components/Flash";
import { query } from "@/lib/db";
import { deleteCategoryAction } from "@/app/actions/admin";

export const metadata = { title: "Manajemen Kategori | Admin" };

const MESSAGES = {
  ok: { created: "Kategori berhasil ditambahkan.", updated: "Kategori berhasil diperbarui.", deleted: "Kategori berhasil dihapus." },
  err: {
    inuse: "Kategori tidak dapat dihapus karena masih dipakai oleh buku.",
    notfound: "Kategori tidak ditemukan.",
  },
};

async function CategoryList({ searchParams }) {
  const sp = await searchParams;
  const { rows: categories } = await query(
    `SELECT c.id, c.nama, c.kode, c.deskripsi, COUNT(b.id)::int AS jumlah_buku
       FROM categories c
       LEFT JOIN books b ON b.category_id = c.id
      GROUP BY c.id
      ORDER BY c.nama`
  );

  return (
    <>
      <Flash ok={sp.ok} err={sp.err} messages={MESSAGES} />
      <div className="mb-4 flex justify-end">
        <Link href="/admin/categories/new" className="rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900">
          Tambah Kategori
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-2 font-medium">Nama</th>
              <th className="px-4 py-2 font-medium">Kode</th>
              <th className="px-4 py-2 font-medium">Deskripsi</th>
              <th className="px-4 py-2 font-medium">Jumlah Buku</th>
              <th className="px-4 py-2 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-stone-500">
                  Belum ada kategori.
                </td>
              </tr>
            )}
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2">{c.nama}</td>
                <td className="px-4 py-2">{c.kode}</td>
                <td className="px-4 py-2 text-stone-600">{c.deskripsi || "-"}</td>
                <td className="px-4 py-2">{c.jumlah_buku}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/categories/${c.id}/edit`} className="text-sm font-medium text-amber-800 hover:underline">
                      Edit
                    </Link>
                    <DeleteForm action={deleteCategoryAction} id={c.id} confirmText={`Hapus kategori "${c.nama}"?`} />
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

export default function CategoriesPage({ searchParams }) {
  return (
    <AdminShell title="Manajemen Kategori">
      <CategoryList searchParams={searchParams} />
    </AdminShell>
  );
}
