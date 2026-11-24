"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookCover from "@/components/BookCover";



export default function BookSlider({ books, label }) {
  const n = books.length;
  const [i, setI] = useState(Math.min(1, n - 1));
  const [hover, setHover] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, []);

  const playing = !hover && !manualPause && !reduced && n > 1;
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 3500);
    return () => clearInterval(t);
  }, [playing, n]);

  const go = (d) => setI((x) => (x + d + n) % n);
  const onKey = (e) => {
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <div
      className="relative left-1/2 w-screen -translate-x-1/2"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onKeyDown={onKey}
    >
      <div
        className="relative h-[400px] overflow-hidden [--gap:14px] [--w:158px] sm:h-[470px] sm:[--gap:20px] sm:[--w:204px]"
        style={{ "--i": i }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[75%] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(232,48,58,0.5),transparent_68%)] blur-2xl"
        />
        <ol
          className="slider-track absolute inset-y-0 left-1/2 flex items-center gap-[var(--gap)] transition-transform duration-700 ease-out"
          style={{
            marginLeft: "calc(var(--w) / -2)",
            transform: "translateX(calc(var(--i) * (var(--w) + var(--gap)) * -1))",
          }}
        >
          {books.map((b, idx) => {
            const d = Math.abs(idx - i);
            const active = d === 0;
            const scale = active ? 1.18 : d === 1 ? 0.92 : 0.8;
            const opacity = active ? 1 : d === 1 ? 0.7 : 0.4;
            return (
              <li
                key={b.id}
                className="slider-card w-[var(--w)] shrink-0 transition-[transform,opacity] duration-700 ease-out"
                style={{ transform: `scale(${scale})`, opacity }}
                aria-roledescription="slide"
                aria-label={`${idx + 1} dari ${n}`}
                aria-current={active ? "true" : undefined}
              >
                <Link
                  href={`/buku/${b.id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={(e) => {
                    if (!active) {
                      e.preventDefault();
                      setI(idx);
                    }
                  }}
                  className={
                    "relative block aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-white " +
                    (active ? "shadow-[0_20px_60px_-10px_rgba(232,48,58,0.55)]" : "")
                  }
                >
                  <BookCover book={b} />
                  <span className="absolute left-2.5 top-2.5 max-w-[60%] truncate rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                    {b.kategori}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 pb-3 pt-12">
                    <span className="block text-sm font-semibold leading-tight text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                      {b.judul}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-white/70">{b.pengarang}</span>
                    <span className="mt-1.5 flex gap-1.5 text-[10px] text-white/80">
                      <span className="rounded-md bg-white/15 px-1.5 py-0.5">{b.tahun_terbit}</span>
                      <span className="rounded-md bg-white/15 px-1.5 py-0.5">{b.jumlah_pinjam}x dipinjam</span>
                      <span
                        className="rounded-md bg-white/15 px-1.5 py-0.5"
                        aria-label={b.jumlah_ulasan > 0 ? `Rating ${b.rating.toFixed(1)} dari 5` : "Belum ada rating"}
                      >
                        {b.jumlah_ulasan > 0 ? (
                          <>
                            <span className="text-amber-600">★</span> {b.rating.toFixed(1)}
                          </>
                        ) : (
                          "Baru"
                        )}
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      {n > 1 && (
        <div className="mt-2 flex items-center justify-center gap-3">
          <button suppressHydrationWarning type="button" onClick={() => go(-1)} aria-label="Sebelumnya" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
            ‹
          </button>
          <div className="flex items-center gap-1.5" role="group" aria-label="Pilih slide">
            {books.map((b, idx) => (
              <button
                suppressHydrationWarning
                key={b.id}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Tampilkan ${b.judul}`}
                aria-current={idx === i ? "true" : undefined}
                className={"h-1.5 rounded-full transition-all " + (idx === i ? "w-6 bg-amber-800" : "w-1.5 bg-white/30 hover:bg-white/50")}
              />
            ))}
          </div>
          <button suppressHydrationWarning type="button" onClick={() => go(1)} aria-label="Berikutnya" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
            ›
          </button>
          <button suppressHydrationWarning type="button" onClick={() => setManualPause((p) => !p)} className="ml-1 rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:bg-white/10" aria-pressed={manualPause}>
            {manualPause ? "Putar" : "Jeda"}
          </button>
        </div>
      )}
    </div>
  );
}
