import { notFound } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { UserForm } from "@/components/AdminForms";
import { query } from "@/lib/db";
import { parseId } from "@/lib/validation";

export const metadata = { title: "Edit User | Admin" };

async function EditUser({ params }) {
  const id = parseId((await params).id);
  if (!id) notFound();
  const { rows } = await query(
    "SELECT id, nama, email, nomor_identitas, role, is_active FROM users WHERE id = $1 AND role <> 'admin'",
    [id]
  );
  if (!rows[0]) notFound();
  return <UserForm user={rows[0]} />;
}

export default function EditUserPage({ params }) {
  return (
    <AdminShell title="Edit User">
      <EditUser params={params} />
    </AdminShell>
  );
}
