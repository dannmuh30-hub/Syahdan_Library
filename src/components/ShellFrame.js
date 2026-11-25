"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "@/components/Avatar";
import ThemeToggle from "@/components/ThemeToggle";
import BrandLogo from "@/components/BrandLogo";


const ICONS = {
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  users: "M16 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM21 20v-1a4 4 0 00-3-3.9M16 4.2a3.5 3.5 0 010 6.6",
  tag: "M3 12V4h8l10 10-8 8L3 12zM7.5 8.5h.01",
  inbox: "M3 13l3-8h12l3 8M3 13v6h18v-6M3 13h5l1 3h6l1-3h5",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6",
  swap: "M4 8h14l-3-3M20 16H6l3 3",
  book: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zM4 19a2 2 0 012-2h13",
  megaphone: "M3 11v3a1 1 0 001 1h2l7 4V6L6 10H4a1 1 0 00-1 1zM17 9a4 4 0 010 6",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6L6 18",
  logout: "M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4M16 8l4 4-4 4M20 12H9",
};

function Icon({ name, className = "h-[18px] w-[18px]" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={ICONS[name]} />
    </svg>
  );
}

function isActive(pathname, item) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

function Brand() {
  return (
    <span className="flex items-center gap-2 text-lg font-bold tracking-tight text-stone-900">
      <BrandLogo size={26} />
      Nongkread
    </span>
  );
}

function NavList({ groups, pathname, onNavigate }) {
  return (
    <nav aria-label="Menu utama" className="flex-1 overflow-y-auto px-3 py-4">
      {groups.map((g) => (
        <div key={g.label} className="mb-5">
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">{g.label}</p>
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const active = isActive(pathname, it);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                      (active
                        ? "bg-amber-100 text-stone-900 shadow-[inset_0_0_0_1px_rgba(232,48,58,0.35)]"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900")
                    }
                  >
                    {active && <span aria-hidden="true" className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-amber-800 shadow-[0_0_10px_2px_rgba(232,48,58,0.6)]" />}
                    <Icon name={it.icon} className={"h-[18px] w-[18px] " + (active ? "text-amber-700" : "text-stone-500 group-hover:text-stone-700")} />
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function UserBox({ user, roleLabel, logout }) {
  return (
    <div className="border-t border-stone-200 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Avatar id={user.id} nama={user.nama} fotoV={user.fotoV} />
        <Link href="/profil" className="min-w-0 hover:underline" title="Buka profil saya">
          <p className="truncate text-sm font-medium text-stone-900">{user.nama}</p>
          <p className="text-xs text-stone-500">{roleLabel}</p>
        </Link>
      </div>
      <div className="space-y-2">
        <ThemeToggle withLabel className="w-full" />
        {logout}
      </div>
    </div>
  );
}



export default function ShellFrame({ groups, user, roleLabel, home = "/", title, width = "max-w-5xl", logout, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex w-full flex-1">
      {}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-stone-200 bg-stone-50 lg:flex">
        <div className="px-6 py-5">
          <Link href={home}><Brand /></Link>
        </div>
        <NavList groups={groups} pathname={pathname} />
        <UserBox user={user} roleLabel={roleLabel} logout={logout} />
      </aside>

      {}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-stone-50/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            aria-expanded={open}
            className="rounded-lg border border-stone-300 p-2 text-stone-700 hover:bg-stone-100"
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>
          <Link href={home}><Brand /></Link>
          <ThemeToggle />
        </div>

        <div className={"fixed inset-0 z-40 lg:hidden " + (open ? "" : "pointer-events-none")} aria-hidden={!open}>
          <div
            onClick={() => setOpen(false)}
            className={"absolute inset-0 bg-black/70 transition-opacity duration-300 " + (open ? "opacity-100" : "opacity-0")}
          />
          <aside
            className={
              "absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r border-stone-200 bg-stone-50 transition-transform duration-300 ease-out " +
              (open ? "translate-x-0" : "-translate-x-full")
            }
          >
            <div className="flex items-center justify-between px-5 py-4">
              <Brand />
              <button type="button" onClick={() => setOpen(false)} aria-label="Tutup menu" className="rounded-lg p-2 text-stone-600 hover:bg-stone-100">
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <NavList groups={groups} pathname={pathname} onNavigate={() => setOpen(false)} />
            <UserBox user={user} roleLabel={roleLabel} logout={logout} />
          </aside>
        </div>

        <main className={"page-enter mx-auto w-full min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-8 " + width}>
          <h1 className="mb-5 text-2xl font-bold text-stone-900">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
