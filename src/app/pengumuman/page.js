import { Suspense } from "react";
import PublicShell from "@/components/PublicShell";
import AnnouncementCard from "@/components/AnnouncementCard";
import { query } from "@/lib/db";

export const metadata = { title: "Pengumuman | Nongkread" };

async function AnnouncementFeed() {
  const { rows } = await query(
    `SELECT id, judul, konten, kategori, to_char(tanggal_rilis, 'YYYY-MM-DD') AS tanggal_iso
       FROM announcements
      WHERE status = 'Published'
      ORDER BY tanggal_rilis DESC, id DESC`
  );
  if (rows.length === 0) {
    return <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-stone-500">Belum ada pengumuman.</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rows.map((a) => (
        <AnnouncementCard key={a.id} a={a} />
      ))}
    </div>
  );
}

export default function AnnouncementsPublicPage() {
  return (
    <PublicShell>
      <h1 className="mb-4 text-2xl font-bold text-stone-900">Pengumuman</h1>
      <Suspense fallback={<p className="py-10 text-center text-stone-500">Memuat pengumuman...</p>}>
        <AnnouncementFeed />
      </Suspense>
    </PublicShell>
  );
}
