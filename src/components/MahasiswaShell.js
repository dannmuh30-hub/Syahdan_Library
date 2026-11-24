import { Suspense } from "react";
import { requireRole } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import NavLinks from "@/components/NavLinks";


const NAV = [
  { href: "/mahasiswa", label: "Dashboard", exact: true },
  { href: "/mahasiswa/loans", label: "Peminjaman Saya" },
  { href: "/mahasiswa/requests", label: "Request Buku" },
  { href: "/katalog", label: "Katalog", also: ["/buku"] },
];

async function Content({ title, children }) {
  const user = await requireRole("mahasiswa");
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <NavLinks items={NAV} />
        <div className="flex items-center gap-3 text-sm text-stone-600">
          <span>{user.nama}</span>
          <form action={logoutAction}>
            <button className="rounded-lg border border-stone-300 px-3 py-1.5 hover:bg-stone-100">Keluar</button>
          </form>
        </div>
      </header>
      <main className="pt-6">
        <h1 className="mb-4 text-2xl font-bold text-stone-900">{title}</h1>
        {typeof children === "function" ? children(user) : children}
      </main>
    </div>
  );
}

export default function MahasiswaShell(props) {
  return (
    <Suspense fallback={<p className="p-10 text-stone-500">Memuat...</p>}>
      <Content {...props} />
    </Suspense>
  );
}
