import Link from "next/link";
import { formatTanggal } from "@/lib/format";

const BADGE = {
  Operasional: "bg-sky-100 text-sky-800",
  Layanan: "bg-emerald-100 text-emerald-800",
  Acara: "bg-violet-100 text-violet-800",
};

export default function AnnouncementCard({ a }) {
  const ringkas = a.konten.length > 140 ? a.konten.slice(0, 140).trimEnd() + "..." : a.konten;
  return (
    <article className="rounded-xl border border-stone-200 p-4">
      <div className="flex items-center gap-2 text-xs">
        <span className={"rounded-full px-2 py-0.5 font-medium " + (BADGE[a.kategori] ?? "bg-stone-100 text-stone-700")}>{a.kategori}</span>
        <span className="text-stone-500">{formatTanggal(a.tanggal_iso)}</span>
      </div>
      <h3 className="mt-2 font-semibold leading-snug text-stone-900">
        <Link href={`/pengumuman/${a.id}`} className="hover:underline">
          {a.judul}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-stone-600">{ringkas}</p>
    </article>
  );
}
