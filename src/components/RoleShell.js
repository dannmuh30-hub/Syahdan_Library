import { Suspense } from "react";
import { requireRole, ROLE_HOME } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { navFor, ROLE_LABEL } from "@/lib/nav";
import ShellFrame from "@/components/ShellFrame";



async function Content({ roles, title, width, children }) {
  const user = await requireRole(...roles);
  const logout = (
    <form action={logoutAction}>
      <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100">
        Keluar
      </button>
    </form>
  );
  return (
    <ShellFrame
      groups={navFor(user.role)}
      user={{ id: user.id, nama: user.nama, fotoV: user.foto_v ?? null }}
      home={ROLE_HOME[user.role] ?? "/"}
      roleLabel={ROLE_LABEL[user.role] ?? user.role}
      title={title}
      width={width}
      logout={logout}
    >
      {typeof children === "function" ? children(user) : children}
    </ShellFrame>
  );
}

function Skeleton() {
  return (
    <div className="flex w-full flex-1">
      <div className="hidden w-64 shrink-0 border-r border-stone-200 bg-stone-50 lg:block" />
      <p className="flex-1 p-8 text-stone-500">Memuat...</p>
    </div>
  );
}

export default function RoleShell(props) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Content {...props} />
    </Suspense>
  );
}
