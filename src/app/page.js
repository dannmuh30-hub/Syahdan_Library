import { Suspense } from "react";
import Link from "next/link";
import PublicShell from "@/components/PublicShell";
import AnnouncementCard from "@/components/AnnouncementCard";
import BookSlider from "@/components/BookSlider";
import BrandLogo from "@/components/BrandLogo";
import { query } from "@/lib/db";


async function HomeContent() {
  const [{ rows: populer }, { rows: pengumuman }] = await Promise.all([
    
    query(
      `SELECT b.id, b.judul, b.pengarang, b.tahun_terbit, b.cover_url, b.category_id, c.nama AS kategori,
              COUNT(l.id)::int AS jumlah_pinjam,
              COALESCE((SELECT AVG(r.rating)::float8 FROM reviews r WHERE r.book_id = b.id), 0) AS rating,
              (SELECT COUNT(*) FROM reviews r WHERE r.book_id = b.id)::int AS jumlah_ulasan
         FROM books b
         JOIN categories c ON c.id = b.category_id
         JOIN loans l ON l.book_id = b.id
        WHERE l.status IN ('Sedang Dipinjam', 'Selesai')
        GROUP BY b.id, c.nama
        ORDER BY jumlah_pinjam DESC, b.judul ASC
        LIMIT 5`
    ),
    query(
      `SELECT id, judul, konten, kategori, to_char(tanggal_rilis, 'YYYY-MM-DD') AS tanggal_iso
         FROM announcements
        WHERE status = 'Published'
        ORDER BY tanggal_rilis DESC, id DESC
        LIMIT 3`
    ),
  ]);

  return (
    <>
      <section className="mt-8" aria-labelledby="populer">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="populer" className="text-lg font-semibold text-stone-900">
            Buku Terpopuler
          </h2>
          <Link href="/katalog" className="text-sm font-medium text-amber-800 hover:underline">
            Lihat semua
          </Link>
        </div>
        <p className="mt-1 text-sm text-stone-500">Paling banyak dipinjam. Klik kartu untuk melihat detail.</p>
        {populer.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">Belum ada data peminjaman.</p>
        ) : (
          <BookSlider books={populer} label="Buku terpopuler" />
        )}
      </section>

      <section className="mt-10" aria-labelledby="pengumuman">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="pengumuman" className="text-lg font-semibold text-stone-900">
            Pengumuman Terbaru
          </h2>
          <Link href="/pengumuman" className="text-sm font-medium text-amber-800 hover:underline">
            Lihat semua
          </Link>
        </div>
        {pengumuman.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">Belum ada pengumuman.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {pengumuman.map((a) => (
              <AnnouncementCard key={a.id} a={a} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default function Home() {
  return (
    <PublicShell>
      <section className="px-2 pb-2 pt-6 text-center sm:pt-10">
        <div className="mb-3 flex justify-center">
          <BrandLogo size={72} className="h-16 w-16 sm:h-20 sm:w-20" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl">Nongkread</h1>
        <p className="mx-auto mt-3 max-w-xl text-stone-600">Temukan buku, baca pengumuman, dan ajukan peminjaman dari satu tempat.</p>
        <form action="/katalog" method="get" className="mx-auto mt-6 flex max-w-xl gap-2" role="search">
          <input
            name="q"
            aria-label="Cari buku berdasarkan judul atau pengarang"
            placeholder="Cari judul atau pengarang"
            className="min-w-0 flex-1 rounded-full border border-stone-300 bg-stone-50 px-5 py-2.5 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
          />
          <button className="rounded-full bg-amber-800 px-6 py-2.5 font-medium text-white hover:bg-amber-900">Cari</button>
        </form>
      </section>
      <Suspense fallback={<p className="py-10 text-center text-stone-500">Memuat...</p>}>
        <HomeContent />
      </Suspense>
    </PublicShell>
  );
}
