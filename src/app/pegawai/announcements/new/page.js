import StaffShell from "@/components/StaffShell";
import AnnouncementForm from "@/components/AnnouncementForm";
import { todayIso } from "@/lib/format";

export const metadata = { title: "Tambah Pengumuman" };

async function NewAnnouncement() {
  return <AnnouncementForm defaultDate={todayIso()} />;
}

export default function NewAnnouncementPage() {
  return (
    <StaffShell title="Tambah Pengumuman">
      <NewAnnouncement />
    </StaffShell>
  );
}
