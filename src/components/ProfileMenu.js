"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/Avatar";



export default function ProfileMenu({ user, roleLabel, home, logout }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item = "block rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-stone-900";

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-amber-800 py-1 pl-1 pr-3 text-sm font-medium text-white hover:bg-amber-900"
      >
        <Avatar id={user.id} nama={user.nama} fotoV={user.fotoV} className="h-7 w-7 text-xs !bg-white/20 !text-white" />
        Profil
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={"h-4 w-4 transition-transform " + (open ? "rotate-180" : "")}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-stone-200 bg-stone-50 p-2 shadow-xl">
          <div className="flex items-center gap-3 border-b border-stone-200 px-3 pb-3 pt-2">
            <Avatar id={user.id} nama={user.nama} fotoV={user.fotoV} className="h-10 w-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-900">{user.nama}</p>
              <p className="text-xs text-stone-500">{roleLabel}</p>
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <Link href={home} role="menuitem" onClick={() => setOpen(false)} className={item}>
              Dashboard
            </Link>
            <Link href="/profil" role="menuitem" onClick={() => setOpen(false)} className={item}>
              Profil Saya
            </Link>
            <div role="none" className="[&_button]:w-full [&_button]:rounded-lg [&_button]:px-3 [&_button]:py-2 [&_button]:text-left [&_button]:text-sm [&_button]:font-medium [&_button]:text-red-700 [&_button]:hover:bg-red-50">
              {logout}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
