const PALETTE = [
  ["#7f1d1d", "#1a0507"],
  ["#1e3a8a", "#050a1f"],
  ["#065f46", "#03140e"],
  ["#6d28d9", "#12062b"],
  ["#9a3412", "#1c0a03"],
  ["#0e7490", "#041a21"],
];

export function coverColors(book) {
  return PALETTE[Math.abs(Number(book.category_id ?? book.id ?? 0)) % PALETTE.length];
}

export default function BookCover({ book, className = "" }) {
  if (book.cover_url) {
    return (
      <img src={book.cover_url} alt={`Sampul ${book.judul}`} className={"h-full w-full object-cover " + className} loading="lazy" />
    );
  }
  const [a, b] = coverColors(book);
  return (
    <div aria-hidden="true" className={"relative h-full w-full overflow-hidden " + className} style={{ background: `linear-gradient(160deg, ${a}, ${b})` }}>
      <span className="absolute -right-3 -top-6 select-none text-[9rem] font-black leading-none text-white/10">
        {book.judul.charAt(0).toUpperCase()}
      </span>
      <span className="absolute inset-x-0 top-1/3 mx-auto block h-px w-1/2 bg-white/20" />
    </div>
  );
}
