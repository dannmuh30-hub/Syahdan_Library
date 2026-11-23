import { Suspense } from "react";
import Link from "next/link";
import PublicShell from "@/components/PublicShell";
import BookCard from "@/components/BookCard";
import { query } from "@/lib/db";
import { parseId } from "@/lib/validation";

export const metadata = { title: "Katalog Buku | Perpustakaan" };

const PAGE_SIZE = 12;

// Urutan hanya dari daftar putih ini (nilai dari URL tidak pernah disisipkan langsung ke SQL).
const SORTS = {
  judul: { label: "Judul (A-Z)", sql: "b.judul ASC" },
  tahun_baru: { label: "Tahun terbit (terbaru)", sql: "b.tahun_terbit DESC, b.judul ASC" },
  tahun_lama: { label: "Tahun terbit (terlama)", sql: "b.tahun_terbit ASC, b.judul ASC" },
  rating: { label: "Rating tertinggi", sql: "r.rata_rating DESC NULLS LAST, r.jumlah DESC NULLS LAST, b.judul ASC" },
};

const inputClass = "rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-700";

async function Catalog({ searchParams }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const pattern = q ? `%${q.replace(/[\\%_]/g, "\\$&")}%` : null;
  const kategori = parseId(sp.kategori);
  const sort = Object.hasOwn(SORTS, sp.sort) ? sp.sort : "judul";
  const page = Math.min(Math.max(parseId(sp.page) ?? 1, 1), 100000);

  const filterSql = `WHERE ($1::int IS NULL OR b.category_id = $1)
                       AND ($2::text IS NULL OR b.judul ILIKE $2 OR b.pengarang ILIKE $2)`;

  const [{ rows: categories }, { rows: count }, { rows: books }] = await Promise.all([
    query("SELECT id, nama FROM categories ORDER BY nama"),
    query(`SELECT COUNT(*)::int AS n FROM books b ${filterSql}`, [kategori, pattern]),
    query(
      `SELECT b.id, b.judul, b.pengarang, b.tahun_terbit, b.stok_total, b.stok_tersedia, b.cover_url, b.category_id,
              c.nama AS kategori,
              COALESCE(r.rata_rating, 0)::float AS rating,
              COALESCE(r.jumlah, 0)::int AS jumlah_ulasan
         FROM books b
         JOIN categories c ON c.id = b.category_id
         LEFT JOIN (
               SELECT book_id, AVG(rating) AS rata_rating, COUNT(*) AS jumlah
                 FROM reviews GROUP BY book_id
              ) r ON r.book_id = b.id
        ${filterSql}
        ORDER BY ${SORTS[sort].sql}
        LIMIT ${PAGE_SIZE} OFFSET $3`,
      [kategori, pattern, (page - 1) * PAGE_SIZE]
    ),
  ]);

  const total = count[0].n;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const href = (p) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (kategori) params.set("kategori", String(kategori));
    if (sort !== "judul") params.set("sort", sort);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `/katalog?${s}` : "/katalog";
  };

  return (
    <>
      <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
        <label className="flex flex-col text-xs font-medium text-stone-600">
          Cari
          <input name="q" defaultValue={q} placeholder="Judul atau pengarang" className={inputClass + " mt-1 w-56"} />
        </label>
        <label className="flex flex-col text-xs font-medium text-stone-600">
          Kategori
          <select name="kategori" defaultValue={kategori ? String(kategori) : ""} className={inputClass + " mt-1"}>
            <option value="">Semua kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nama}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-xs font-medium text-stone-600">
          Urutkan
          <select name="sort" defaultValue={sort} className={inputClass + " mt-1"}>
            {Object.entries(SORTS).map(([value, s]) => (
              <option key={value} value={value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button className="rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900">Terapkan</button>
        {(q || kategori || sort !== "judul") && (
          <Link href="/katalog" className="py-2 text-sm text-stone-600 hover:underline">
            Reset
          </Link>
        )}
      </form>

      <p className="mb-3 text-sm text-stone-600" role="status">
        {total} buku ditemukan
      </p>

      {books.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-stone-500">Tidak ada buku yang cocok dengan pencarian.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-4 text-sm" aria-label="Halaman katalog">
          {page > 1 ? (
            <Link href={href(page - 1)} className="font-medium text-amber-800 hover:underline">
              Sebelumnya
            </Link>
          ) : (
            <span className="text-stone-400">Sebelumnya</span>
          )}
          <span className="text-stone-600">
            Halaman {page} dari {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={href(page + 1)} className="font-medium text-amber-800 hover:underline">
              Berikutnya
            </Link>
          ) : (
            <span className="text-stone-400">Berikutnya</span>
          )}
        </nav>
      )}
    </>
  );
}

export default function CatalogPage({ searchParams }) {
  return (
    <PublicShell>
      <h1 className="mb-4 text-2xl font-bold text-stone-900">Katalog Buku</h1>
      {/* Query database dan searchParams bersifat dinamis, jadi harus di dalam <Suspense> (Cache Components). */}
      <Suspense fallback={<p className="py-10 text-center text-stone-500">Memuat katalog...</p>}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </PublicShell>
  );
}
