import Link from "next/link";
import BookCover from "@/components/BookCover";


export default function BookCard({ book }) {
  const habis = book.stok_tersedia <= 0;
  const punyaRating = book.jumlah_ulasan > 0;
  return (
    <article className="group relative aspect-[2/3] overflow-hidden rounded-2xl border border-stone-200 transition duration-300 hover:-translate-y-1 hover:border-amber-800/60 hover:shadow-[0_18px_50px_-12px_rgba(232,48,58,0.5)]">
      <div className="absolute inset-0 transition duration-500 group-hover:scale-105">
        <BookCover book={book} />
      </div>
      {}
      <Link href={`/buku/${book.id}`} aria-hidden="true" tabIndex={-1} className="absolute inset-0 z-10" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-3 pb-3 pt-16">
        <h2 className="relative z-20 text-sm font-semibold leading-snug text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
          <Link href={`/buku/${book.id}`} className="outline-none focus-visible:underline">
            {book.judul}
          </Link>
        </h2>
        <p className="mt-0.5 truncate text-xs text-white/70">{book.pengarang}</p>
        <p className="mt-0.5 truncate text-[11px] text-white/60">
          {book.kategori} · {book.tahun_terbit}
        </p>
        <p className="mt-1 text-[11px] text-white/80">
          {punyaRating ? (
            <span aria-label={`Rating ${book.rating.toFixed(1)} dari 5, ${book.jumlah_ulasan} ulasan`}>
              <span className="text-amber-600">★</span> <span className="font-semibold text-white">{book.rating.toFixed(1)}</span> ({book.jumlah_ulasan} ulasan)
            </span>
          ) : (
            <span>Belum ada rating</span>
          )}
        </p>
        <p className={"mt-1 text-[11px] font-medium " + (habis ? "text-red-700" : "text-green-800")}>
          {habis ? "Stok habis" : `Tersedia ${book.stok_tersedia} dari ${book.stok_total}`}
        </p>
      </div>
    </article>
  );
}
