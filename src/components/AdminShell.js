import { Suspense } from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "User" },
  { href: "/admin/categories", label: "Kategori" },
  { href: "/admin/transactions", label: "Transaksi" },
  { href: "/admin/requests", label: "Request Buku" },
  { href: "/pegawai/loans", label: "Peminjaman" },
  { href: "/pegawai/books", label: "Buku" },
  { href: "/pegawai/announcements", label: "Pengumuman" },
];

// Kerangka semua halaman Admin. Pengecekan role terjadi sebelum `children` dirender.
// Membaca cookie harus di dalam <Suspense> karena Cache Components aktif.
async function Content({ title, children }) {
  const user = await requireRole("admin");
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <nav className="flex flex-wrap gap-1 text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-lg px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm text-stone-600">
          <span>{user.nama}</span>
          <form action={logoutAction}>
            <button className="rounded-lg border border-stone-300 px-3 py-1.5 hover:bg-stone-100">Keluar</button>
          </form>
        </div>
      </header>
      <main className="pt-6">
        <h1 className="mb-4 text-2xl font-bold text-stone-900">{title}</h1>
        {children}
      </main>
    </div>
  );
}

export default function AdminShell(props) {
  return (
    <Suspense fallback={<p className="p-10 text-stone-500">Memuat...</p>}>
      <Content {...props} />
    </Suspense>
  );
}
