import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Manajemen Perpustakaan</h1>
      <p className="mt-2 text-stone-600">
        Katalog, pengumuman, dan layanan peminjaman buku perpustakaan kampus.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/login" className="rounded-lg bg-amber-800 px-4 py-2.5 font-medium text-white hover:bg-amber-900">
          Masuk
        </Link>
        <Link href="/register" className="rounded-lg border border-stone-300 px-4 py-2.5 font-medium text-stone-700 hover:bg-stone-100">
          Daftar
        </Link>
      </div>
    </main>
  );
}
