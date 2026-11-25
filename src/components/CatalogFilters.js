"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const inputClass = "rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-700";
const DEFAULT_SORT = "judul";
const DEBOUNCE_MS = 400;




export default function CatalogFilters({ q, kategori, sort, categories, sorts }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [qText, setQText] = useState(q);
  const [kat, setKat] = useState(kategori);
  const [urut, setUrut] = useState(sort);
  const [pushedQ, setPushedQ] = useState(q); 

  
  const [prev, setPrev] = useState({ q, kategori, sort });
  if (prev.q !== q || prev.kategori !== kategori || prev.sort !== sort) {
    setPrev({ q, kategori, sort });
    setKat(kategori);
    setUrut(sort);
    if (q !== pushedQ) {
      setQText(q);
      setPushedQ(q);
    }
  }

  const go = (next, replace = true) => {
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.kategori) params.set("kategori", next.kategori);
    if (next.sort && next.sort !== DEFAULT_SORT) params.set("sort", next.sort);
    const s = params.toString();
    const url = s ? `/katalog?${s}` : "/katalog";
    startTransition(() => (replace ? router.replace(url, { scroll: false }) : router.push(url, { scroll: false })));
  };

  
  useEffect(() => {
    const clean = qText.trim();
    if (clean === pushedQ) return;
    const t = setTimeout(() => {
      setPushedQ(clean);
      go({ q: clean, kategori: kat, sort: urut });
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
    
  }, [qText]);

  const dirty = Boolean(qText.trim() || kat || urut !== DEFAULT_SORT);

  const reset = () => {
    setQText("");
    setPushedQ("");
    setKat("");
    setUrut(DEFAULT_SORT);
    go({ q: "", kategori: "", sort: DEFAULT_SORT }, false);
  };

  return (
    <form
      role="search"
      aria-busy={pending}
      onSubmit={(e) => {
        e.preventDefault();
        const clean = qText.trim();
        setPushedQ(clean);
        go({ q: clean, kategori: kat, sort: urut });
      }}
      className="mb-6 flex flex-wrap items-end gap-3"
    >
      <label className="flex flex-col text-xs font-medium text-stone-600">
        Cari
        <input
          type="search"
          value={qText}
          onChange={(e) => setQText(e.target.value)}
          placeholder="Judul atau pengarang"
          maxLength={100}
          className={inputClass + " mt-1 w-56"}
        />
      </label>
      <label className="flex flex-col text-xs font-medium text-stone-600">
        Kategori
        <select
          value={kat}
          onChange={(e) => {
            setKat(e.target.value);
            go({ q: qText.trim(), kategori: e.target.value, sort: urut }, false);
          }}
          className={inputClass + " mt-1"}
        >
          <option value="">Semua kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.nama}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col text-xs font-medium text-stone-600">
        Urutkan
        <select
          value={urut}
          onChange={(e) => {
            setUrut(e.target.value);
            go({ q: qText.trim(), kategori: kat, sort: e.target.value }, false);
          }}
          className={inputClass + " mt-1"}
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      {dirty && (
        <button type="button" onClick={reset} className="rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900">
          Reset
        </button>
      )}
      {pending && <span className="py-2 text-xs text-stone-500" role="status">Memuat...</span>}
    </form>
  );
}
