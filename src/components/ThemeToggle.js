"use client";

import { useSyncExternalStore } from "react";



function subscribe(cb) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}
const getSnapshot = () => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const getServerSnapshot = () => "dark";

export default function ThemeToggle({ withLabel = false, className = "" }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toLight = theme === "dark";

  const toggle = () => {
    const next = toLight ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={toLight ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      title={toLight ? "Mode terang" : "Mode gelap"}
      className={
        "flex items-center justify-center gap-2 rounded-lg border border-stone-300 p-2 text-stone-700 transition-colors hover:bg-stone-100 " + className
      }
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
        {toLight ? (
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
      {withLabel && <span className="text-sm font-medium">{toLight ? "Mode terang" : "Mode gelap"}</span>}
    </button>
  );
}
