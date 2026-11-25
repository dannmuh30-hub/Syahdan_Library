import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { query } from "@/lib/db";

export const ROLE_HOME = {
  admin: "/admin",
  pegawai: "/pegawai",
  mahasiswa: "/mahasiswa",
};



export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const { rows } = await query(
    `SELECT id, nama, email, role, nomor_identitas,
            CASE WHEN foto_data IS NOT NULL THEN EXTRACT(EPOCH FROM foto_diubah)::bigint END AS foto_v
       FROM users WHERE id = $1 AND is_active = TRUE`,
    [session.uid]
  );
  return rows[0] ?? null;
}



export async function requireRole(...roles) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!roles.includes(user.role)) redirect(ROLE_HOME[user.role] ?? "/");
  return user;
}
