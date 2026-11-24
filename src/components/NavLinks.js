"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";




function isActive(pathname, item) {
  if (pathname === item.href) return true;
  if (item.exact) return false;
  const prefixes = [item.href, ...(item.also ?? [])];
  return prefixes.some((p) => pathname.startsWith(p + "/"));
}

function NavList({ items, label, pathname }) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-1 text-sm">
      {items.map((n) => {
        const active = isActive(pathname, n);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={
              "rounded-lg px-3 py-1.5 font-medium transition-colors " +
              (active
                ? "bg-amber-800 text-white shadow-[0_0_16px_-2px_rgba(232,48,58,0.7)]"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900")
            }
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function NavLinks({ items, label = "Menu utama" }) {
  const pathname = usePathname();
  return <NavList items={items} label={label} pathname={pathname} />;
}


export function NavLinksPlain({ items, label = "Menu utama" }) {
  return <NavList items={items} label={label} pathname="" />;
}
