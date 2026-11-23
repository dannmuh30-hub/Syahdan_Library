import AdminShell from "@/components/AdminShell";
import { UserForm } from "@/components/AdminForms";

export const metadata = { title: "Tambah User | Admin" };

export default function NewUserPage() {
  return (
    <AdminShell title="Tambah User">
      <UserForm />
    </AdminShell>
  );
}
