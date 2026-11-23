import AdminShell from "@/components/AdminShell";
import { CategoryForm } from "@/components/AdminForms";

export const metadata = { title: "Tambah Kategori | Admin" };

export default function NewCategoryPage() {
  return (
    <AdminShell title="Tambah Kategori">
      <CategoryForm />
    </AdminShell>
  );
}
