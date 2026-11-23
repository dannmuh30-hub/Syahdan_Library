import { redirect } from "next/navigation";
import StaffShell from "@/components/StaffShell";
import BookForm from "@/components/BookForm";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { parseId } from "@/lib/validation";

export const metadata = { title: "Tambah Buku" };

async function NewBook({ searchParams }) {
  // Menambah buku hanya untuk Admin; Pegawai dikembalikan ke daftar buku dengan pesan.
  const user = await requireRole("pegawai", "admin");
  if (user.role !== "admin") redirect("/pegawai/books?err=adminonly");

  const sp = await searchParams;
  const { rows: categories } = await query("SELECT id, nama FROM categories ORDER BY nama");
  if (categories.length === 0) {
    return <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-200">Belum ada kategori. Tambahkan kategori terlebih dahulu.</p>;
  }

  // Prefill dari request yang sudah disetujui (diambil dari database, bukan dari URL).
  let prefill;
  const requestId = parseId(sp.request);
  if (requestId) {
    const { rows } = await query(
      "SELECT id, judul, pengarang, penerbit, tahun_terbit, alasan FROM book_requests WHERE id = $1 AND status = 'Disetujui'",
      [requestId]
    );
    const r = rows[0];
    if (r) {
      prefill = {
        requestId: r.id,
        values: { judul: r.judul, pengarang: r.pengarang, penerbit: r.penerbit ?? "", tahun_terbit: r.tahun_terbit ?? "" },
      };
    }
  }
  return (
    <>
      {prefill && <p className="mb-4 rounded-lg bg-sky-100 px-3 py-2 text-sm text-sky-800">Data diisi dari request Mahasiswa. Lengkapi ISBN, kategori, dan stok.</p>}
      <BookForm categories={categories} prefill={prefill} />
    </>
  );
}

export default function NewBookPage({ searchParams }) {
  return (
    <StaffShell title="Tambah Buku">
      <NewBook searchParams={searchParams} />
    </StaffShell>
  );
}
