import DashboardShell from "@/components/DashboardShell";

export const metadata = { title: "Dashboard Pegawai" };

export default function PegawaiPage() {
  return (
    <DashboardShell roles={["pegawai", "admin"]} title="Dashboard Pegawai">
      Antrean verifikasi dan meja pengembalian akan dibangun di Hari 6 dan 8.
    </DashboardShell>
  );
}
