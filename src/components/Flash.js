"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";




const DURASI_MS = 5000;

export default function Flash({ ok, err, messages }) {
  const router = useRouter();
  const errText = err && messages.err[err];
  const okText = !errText && ok && messages.ok[ok];
  const key = errText ? "e:" + err : okText ? "o:" + ok : null;

  const [shown, setShown] = useState(null); 
  const [prevKey, setPrevKey] = useState(null);
  if (key !== prevKey) {
    setPrevKey(key);
    if (key) setShown({ text: errText || okText, isErr: Boolean(errText) });
  }

  
  useEffect(() => {
    if (!key) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("ok");
    url.searchParams.delete("err");
    router.replace(url.pathname + url.search, { scroll: false });
  }, [key, router]);

  
  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setShown(null), DURASI_MS);
    return () => clearTimeout(t);
  }, [shown]);

  if (!shown) return null;
  return (
    <div
      role={shown.isErr ? "alert" : "status"}
      className={
        "mb-4 flex items-start justify-between gap-3 rounded-lg px-3 py-2 text-sm " +
        (shown.isErr ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800")
      }
    >
      <span>{shown.text}</span>
      <button type="button" onClick={() => setShown(null)} aria-label="Tutup pesan" className="shrink-0 leading-none opacity-70 hover:opacity-100">
        ×
      </button>
    </div>
  );
}
