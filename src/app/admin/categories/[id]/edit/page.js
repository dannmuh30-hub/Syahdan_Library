import { notFound } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { CategoryForm } from "@/components/AdminForms";
import { query } from "@/lib/db";
import { parseId } from "@/lib/validation";

export const metadata = { title: "Edit Kategori | Admin" };

async function EditCategory({ params }) {
  const id = parseId((await params).id);
  if (!id) notFound();
  const { rows } = await query("SELECT id, nama, kode, deskripsi FROM categories WHERE id = $1", [id]);
  if (!rows[0]) notFound();
  return <CategoryForm category={rows[0]} />;
}

export default function EditCategoryPage({ params }) {
  return (
    <AdminShell title="Edit Kategori">
      <EditCategory params={params} />
    </AdminShell>
  );
}
