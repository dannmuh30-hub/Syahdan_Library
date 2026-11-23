import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicShell from "@/components/PublicShell";
import BookCover from "@/components/BookCover";
import Flash from "@/components/Flash";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ajukanPinjamAction } from "@/app/actions/loans";
import { parseId } from "@/lib/validation";
import { formatRupiah, formatTanggal } from "@/lib/format";

export const metadata = { title: "Detail Buku | Perpustakaan" };

const MESSAGES = {
  ok: { requested: "Pengajuan peminjaman terkirim. Tunggu konfirmasi Pegawai di meja sirkulasi. Pantau statusnya di menu Peminjaman Saya." },
  err: {
    stok: "Stok buku sedang habis.",
    denda: "Pengajuan diblokir karena kamu masih memiliki denda tertunggak.",
    duplicate: "Kamu sudah mengajukan atau sedang meminjam buku ini.",
  },
};

const btn = "inline-block rounded-lg px-4 py-2.5 text-sm font-medium";

async function BorrowPanel({ book }) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div>
        <p className="text-sm text-stone-600">Masuk atau daftar sebagai Mahasiswa untuk meminjam buku ini.</p>
        <Link href="/login" className={btn + " mt-2 bg-amber-800 text-white hover:bg-amber-900"}>
          Masuk untuk meminjam
        </Link>
      </div>
    );
  }
  if (user.role !== "mahasiswa") {
    return <p className="text-sm text-stone-500">Peminjaman hanya tersedia untuk akun Mahasiswa.</p>;
  }

  const [{ rows: denda }, { rows: aktif }] = await Promise.all([
    query("SELECT COALESCE(SUM(denda_nominal), 0)::int AS total FROM loans WHERE user_id = $1 AND status_denda = 'Tertunggak'", [user.id]),
    query("SELECT status FROM loans WHERE user_id = $1 AND book_id = $2 AND status IN ('Menunggu Konfirmasi', 'Sedang Dipinjam') LIMIT 1", [user.id, book.id]),
  ]);

  let reason = null;
  if (aktif[0]) reason = aktif[0].status === "Sedang Dipinjam" ? "Kamu sedang meminjam buku ini." : "Pengajuanmu untuk buku ini sedang menunggu konfirmasi.";
  else if (denda[0].total > 0) reason = `Pengajuan diblokir: kamu memiliki denda tertunggak ${formatRupiah(denda[0].total)}. Lunasi denda di meja sirkulasi.`;
  else if (book.stok_tersedia <= 0) reason = "Stok buku sedang habis.";

  if (reason) {
    return (
      <div>
        <button disabled className={btn + " cursor-not-allowed bg-stone-200 text-stone-500"}>
          Ajukan Pinjam
        </button>
        <p className="mt-2 text-sm text-stone-600">{reason}</p>
      </div>
    );
  }
  return (
    <form action={ajukanPinjamAction}>
      <input type="hidden" name="book_id" value={book.id} />
      <button type="submit" className={btn + " bg-amber-800 text-white hover:bg-amber-900"}>
        Ajukan Pinjam
      </button>
    </form>
  );
}

async function BookDetail({ params, searchParams }) {
  const id = parseId((await params).id);
  if (!id) notFound();
  const sp = await searchParams;

  const [{ rows }, { rows: reviews }] = await Promise.all([
    query(
      `SELECT b.id, b.judul, b.isbn, b.pengarang, b.penerbit, b.tahun_terbit, b.stok_total, b.stok_tersedia,
              b.durasi_maks_pinjam, b.denda_per_hari, b.cover_url, b.category_id, b.deskripsi, c.nama AS kategori,
              COALESCE((SELECT AVG(rating) FROM reviews WHERE book_id = b.id), 0)::float AS rating,
              (SELECT COUNT(*) FROM reviews WHERE book_id = b.id)::int AS jumlah_ulasan
         FROM books b JOIN categories c ON c.id = b.category_id
        WHERE b.id = $1`,
      [id]
    ),
    query(
      `SELECT r.rating, r.komentar, to_char(r.created_at, 'YYYY-MM-DD') AS tanggal_iso, u.nama
         FROM reviews r JOIN users u ON u.id = r.user_id
        WHERE r.book_id = $1
        ORDER BY r.created_at DESC, r.id DESC`,
      [id]
    ),
  ]);
  const b = rows[0];
  if (!b) notFound();

  const meta = [
    ["ISBN", b.isbn],
    ["Penerbit", b.penerbit],
    ["Tahun terbit", b.tahun_terbit],
    ["Kategori", b.kategori],
    ["Stok tersedia", `${b.stok_tersedia} dari ${b.stok_total} eksemplar`],
    ["Maksimal lama pinjam", `${b.durasi_maks_pinjam} hari`],
    ["Denda keterlambatan", `${formatRupiah(b.denda_per_hari)} per hari`],
  ];

  return (
    <>
      <Flash ok={sp.ok} err={sp.err} messages={MESSAGES} />
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="aspect-[2/3] w-44 shrink-0 self-start overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(232,48,58,0.55)]">
          <BookCover book={b} />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-snug text-stone-900">{b.judul}</h1>
          <p className="mt-1 text-stone-600">{b.pengarang}</p>
          <p className="mt-2 text-sm text-stone-700">
            {b.jumlah_ulasan > 0 ? (
              <>
                <span className="text-amber-600">★</span> {b.rating.toFixed(1)} <span className="text-stone-500">({b.jumlah_ulasan} ulasan)</span>
              </>
            ) : (
              <span className="text-stone-500">Belum ada rating</span>
            )}
          </p>
          {b.deskripsi && <p className="mt-3 max-w-prose text-sm leading-relaxed text-stone-700">{b.deskripsi}</p>}
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
            {meta.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-stone-500">{k}</dt>
                <dd className="text-stone-900">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5">
            <Suspense fallback={<div className="h-10" />}>
              <BorrowPanel book={b} />
            </Suspense>
          </div>
        </div>
      </div>

      <section className="mt-10" aria-labelledby="ulasan">
        <h2 id="ulasan" className="mb-3 text-lg font-semibold text-stone-900">
          Ulasan Mahasiswa
        </h2>
        {reviews.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">Belum ada ulasan untuk buku ini.</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r, i) => (
              <li key={i} className="rounded-xl border border-stone-200 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-900">{r.nama}</span>
                  <span className="text-stone-500">{formatTanggal(r.tanggal_iso)}</span>
                </div>
                <p className="mt-1 text-sm text-amber-600" aria-label={`Rating ${r.rating} dari 5`}>
                  {"★".repeat(r.rating)}
                  <span className="text-stone-300">{"★".repeat(5 - r.rating)}</span>
                </p>
                <p className="mt-1 text-sm text-stone-700">{r.komentar}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default function BookDetailPage({ params, searchParams }) {
  return (
    <PublicShell>
      <Link href="/katalog" className="mb-4 inline-block text-sm text-amber-800 hover:underline">
        &larr; Kembali ke katalog
      </Link>
      <Suspense fallback={<p className="py-10 text-center text-stone-500">Memuat...</p>}>
        <BookDetail params={params} searchParams={searchParams} />
      </Suspense>
    </PublicShell>
  );
}
