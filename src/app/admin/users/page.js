import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import DeleteForm from "@/components/DeleteForm";
import Flash from "@/components/Flash";
import { query } from "@/lib/db";
import { deleteUserAction } from "@/app/actions/admin";
import { ASSIGNABLE_ROLES, ROLE_LABEL } from "@/lib/validation";

export const metadata = { title: "Manajemen User | Admin" };

const MESSAGES = {
  ok: { created: "User berhasil ditambahkan.", updated: "User berhasil diperbarui.", deleted: "User berhasil dihapus." },
  err: {
    self: "Kamu tidak dapat menghapus akunmu sendiri.",
    active: "User tidak dapat dihapus karena masih memiliki peminjaman yang berjalan.",
    fine: "User tidak dapat dihapus karena masih memiliki denda yang belum lunas.",
    notfound: "User tidak ditemukan.",
  },
};

async function UserList({ searchParams }) {
  const sp = await searchParams;
  const role = ASSIGNABLE_ROLES.includes(sp.role) ? sp.role : null;
  const { rows: users } = await query(
    `SELECT id, nama, email, nomor_identitas, role, is_active
       FROM users
      WHERE role <> 'admin' AND ($1::text IS NULL OR role = $1)
      ORDER BY CASE role WHEN 'pegawai' THEN 1 ELSE 2 END, nama`,
    [role]
  );

  return (
    <>
      <Flash ok={sp.ok} err={sp.err} messages={MESSAGES} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-sm" aria-label="Filter role">
          {[null, ...ASSIGNABLE_ROLES].map((r) => (
            <Link
              key={r ?? "semua"}
              href={r ? `/admin/users?role=${r}` : "/admin/users"}
              className={
                "rounded-full border px-3 py-1 " +
                (role === r ? "border-amber-800 bg-amber-800 text-white" : "border-stone-300 text-stone-700 hover:bg-stone-100")
              }
            >
              {r ? ROLE_LABEL[r] : "Semua"}
            </Link>
          ))}
        </div>
        <Link href="/admin/users/new" className="rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900">
          Tambah User
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-2 font-medium">Nama</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">NIM/NIP</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-stone-500">
                  Belum ada user.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2">{u.nama}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.nomor_identitas}</td>
                <td className="px-4 py-2">{ROLE_LABEL[u.role]}</td>
                <td className="px-4 py-2">
                  <span className={u.is_active ? "text-green-700" : "text-stone-500"}>{u.is_active ? "Aktif" : "Nonaktif"}</span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/users/${u.id}/edit`} className="text-sm font-medium text-amber-800 hover:underline">
                      Edit
                    </Link>
                    <DeleteForm action={deleteUserAction} id={u.id} confirmText={`Hapus user "${u.nama}"? Riwayat peminjaman dan ulasannya juga akan ikut terhapus.`} />
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

export default function UsersPage({ searchParams }) {
  return (
    <AdminShell title="Manajemen User">
      <UserList searchParams={searchParams} />
    </AdminShell>
  );
}
