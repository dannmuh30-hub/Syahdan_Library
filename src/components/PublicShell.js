import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUser, ROLE_HOME } from "@/lib/auth";

// Header halaman publik (Guest dan Mahasiswa). Status login dibaca di dalam <Suspense>
// tersendiri agar isi halaman tidak ikut menunggu.
async function UserNav() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Link href="/login" className="rounded-lg px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100">
          Masuk
        </Link>
        <Link href="/register" className="rounded-lg bg-amber-800 px-3 py-1.5 font-medium text-white hover:bg-amber-900">
          Daftar
        </Link>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="hidden text-stone-600 sm:inline">{user.nama}</span>
      <Link href={ROLE_HOME[user.role] ?? "/"} className="rounded-lg border border-stone-300 px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100">
        Dashboard
      </Link>
    </div>
  );
}

export default function PublicShell({ children }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/" className="mr-3 flex items-center gap-2 text-lg font-bold tracking-tight text-stone-900">
            <span aria-hidden="true" className="inline-block h-3 w-3 rounded-full bg-amber-800 shadow-[0_0_14px_3px_rgba(232,48,58,0.7)]" />
            Perpustakaan
          </Link>
          <Link href="/katalog" className="rounded-lg px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100">
            Katalog
          </Link>
          <Link href="/pengumuman" className="rounded-lg px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100">
            Pengumuman
          </Link>
        </nav>
        <Suspense fallback={<div className="h-8 w-32" />}>
          <UserNav />
        </Suspense>
      </header>
      <main className="pt-6">{children}</main>
    </div>
  );
}
