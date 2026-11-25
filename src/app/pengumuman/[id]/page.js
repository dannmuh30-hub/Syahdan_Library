import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicShell from "@/components/PublicShell";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { parseId } from "@/lib/validation";
import { formatTanggal } from "@/lib/format";

export const metadata = { title: "Detail Pengumuman | Nongkread" };

async function AnnouncementDetail({ params }) {
  const id = parseId((await params).id);
  if (!id) notFound();
  const { rows } = await query(
    `SELECT a.id, a.judul, a.konten, a.kategori, a.status, to_char(a.tanggal_rilis, 'YYYY-MM-DD') AS tanggal_iso, u.nama AS penulis
       FROM announcements a
       LEFT JOIN users u ON u.id = a.author_id
      WHERE a.id = $1`,
    [id]
  );
  const a = rows[0];
  if (!a) notFound();

  
  const isDraft = a.status !== "Published";
  if (isDraft) {
    const user = await getCurrentUser();
    if (!user || (user.role !== "pegawai" && user.role !== "admin")) notFound();
  }

  return (
    <article className="max-w-2xl">
      {isDraft && <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-200">Pratinjau draft: pengumuman ini belum tampil untuk publik.</p>}
      <p className="text-sm text-stone-500">
        {a.kategori} · {formatTanggal(a.tanggal_iso)}
        {a.penulis ? ` · ${a.penulis}` : ""}
      </p>
      <h1 className="mt-1 text-2xl font-bold text-stone-900">{a.judul}</h1>
      <p className="mt-4 whitespace-pre-line leading-relaxed text-stone-800">{a.konten}</p>
      <Link href="/pengumuman" className="mt-6 inline-block text-sm font-medium text-amber-800 hover:underline">
        Kembali ke daftar pengumuman
      </Link>
    </article>
  );
}

export default function AnnouncementDetailPage({ params }) {
  return (
    <PublicShell>
      <Suspense fallback={<p className="py-10 text-center text-stone-500">Memuat...</p>}>
        <AnnouncementDetail params={params} />
      </Suspense>
    </PublicShell>
  );
}
