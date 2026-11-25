import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUser, ROLE_HOME } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { ROLE_LABEL } from "@/lib/nav";
import ProfileMenu from "@/components/ProfileMenu";
import ThemeToggle from "@/components/ThemeToggle";
import BrandLogo from "@/components/BrandLogo";



async function UserNav() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="ml-auto flex items-center gap-2 text-sm">
        <ThemeToggle />
        <Link href="/login" className="rounded-lg px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100">
          Masuk
        </Link>
        <Link href="/register" className="rounded-lg bg-amber-800 px-3 py-1.5 font-medium text-white hover:bg-amber-900">
          Daftar
        </Link>
      </div>
    );
  }
  const logout = (
    <form action={logoutAction}>
      <button>Keluar</button>
    </form>
  );
  return (
    <div className="ml-auto flex items-center gap-2 text-sm">
      <ThemeToggle />
      <ProfileMenu
        user={{ id: user.id, nama: user.nama, fotoV: user.foto_v ?? null }}
        roleLabel={ROLE_LABEL[user.role] ?? user.role}
        home={ROLE_HOME[user.role] ?? "/"}
        logout={logout}
      />
    </div>
  );
}

function Footer() {
  const link = "text-stone-500 transition-colors hover:text-stone-900";
  const heading = "flex h-6 items-center text-sm font-semibold text-stone-800";
  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid w-full max-w-5xl gap-x-8 gap-y-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="flex h-6 items-center gap-2 text-base font-bold tracking-tight text-stone-900">
            <BrandLogo size={24} />
            Nongkread
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-500">
            Sistem manajemen perpustakaan kampus: telusuri koleksi, baca pengumuman, dan ajukan peminjaman dari satu tempat.
          </p>
        </div>
        <nav aria-label="Jelajahi">
          <p className={heading}>Jelajahi</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/" className={link}>Beranda</Link></li>
            <li><Link href="/katalog" className={link}>Katalog Buku</Link></li>
            <li><Link href="/pengumuman" className={link}>Pengumuman</Link></li>
          </ul>
        </nav>
        <nav aria-label="Akun">
          <p className={heading}>Akun</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/login" className={link}>Masuk</Link></li>
            <li><Link href="/register" className={link}>Daftar sebagai Mahasiswa</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-stone-200">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-1 px-4 py-5 text-xs text-stone-500 sm:flex-row">
          <p>© 2026 Nongkread</p>
          <p>Tugas Final Praktikum Pemrograman Web</p>
        </div>
      </div>
    </footer>
  );
}

export default function PublicShell({ children }) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/" className="mr-3 flex items-center gap-2 text-lg font-bold tracking-tight text-stone-900">
            <BrandLogo size={28} />
            Nongkread
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
      <main className="page-enter pt-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
