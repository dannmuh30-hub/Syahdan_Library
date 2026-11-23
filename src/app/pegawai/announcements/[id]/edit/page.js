import { notFound } from "next/navigation";
import StaffShell from "@/components/StaffShell";
import AnnouncementForm from "@/components/AnnouncementForm";
import { query } from "@/lib/db";
import { parseId } from "@/lib/validation";

export const metadata = { title: "Edit Pengumuman" };

async function EditAnnouncement({ params }) {
  const id = parseId((await params).id);
  if (!id) notFound();
  const { rows } = await query(
    `SELECT id, judul, konten, kategori, status, to_char(tanggal_rilis, 'YYYY-MM-DD') AS tanggal_rilis_iso
       FROM announcements WHERE id = $1`,
    [id]
  );
  if (!rows[0]) notFound();
  return <AnnouncementForm announcement={rows[0]} />;
}

export default function EditAnnouncementPage({ params }) {
  return (
    <StaffShell title="Edit Pengumuman">
      <EditAnnouncement params={params} />
    </StaffShell>
  );
}
