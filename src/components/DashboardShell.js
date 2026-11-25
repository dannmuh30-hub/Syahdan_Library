import { Suspense } from "react";
import { requireRole } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";



async function Content({ roles, title, children }) {
  const user = await requireRole(...roles);
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
          <p className="mt-1 text-stone-600">
            Masuk sebagai <strong>{user.nama}</strong> ({user.role})
          </p>
        </div>
        <form action={logoutAction}>
          <button className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100">
            Keluar
          </button>
        </form>
      </div>
      <div className="mt-6 rounded-xl border border-dashed border-stone-300 p-6 text-stone-600">
        {children}
      </div>
    </main>
  );
}

export default function DashboardShell(props) {
  return (
    <Suspense fallback={<p className="p-10 text-stone-500">Memuat...</p>}>
      <Content {...props} />
    </Suspense>
  );
}
