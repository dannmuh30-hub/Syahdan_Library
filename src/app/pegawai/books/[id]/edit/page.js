import { notFound } from "next/navigation";
import StaffShell from "@/components/StaffShell";
import BookForm from "@/components/BookForm";
import { query } from "@/lib/db";
import { parseId } from "@/lib/validation";

export const metadata = { title: "Edit Buku" };

async function EditBook({ params }) {
  const id = parseId((await params).id);
  if (!id) notFound();
  const [{ rows }, { rows: categories }] = await Promise.all([
    query(
      `SELECT id, judul, isbn, pengarang, penerbit, tahun_terbit, category_id, stok_total, stok_tersedia,
              durasi_maks_pinjam, denda_per_hari, cover_url, deskripsi
         FROM books WHERE id = $1`,
      [id]
    ),
    query("SELECT id, nama FROM categories ORDER BY nama"),
  ]);
  const book = rows[0];
  if (!book) notFound();
  return <BookForm book={book} categories={categories} dipinjam={book.stok_total - book.stok_tersedia} />;
}

export default function EditBookPage({ params }) {
  return (
    <StaffShell title="Edit Buku">
      <EditBook params={params} />
    </StaffShell>
  );
}
