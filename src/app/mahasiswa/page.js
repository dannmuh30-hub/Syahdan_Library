import DashboardShell from "@/components/DashboardShell";

export const metadata = { title: "Dashboard Mahasiswa" };

export default function MahasiswaPage() {
  return (
    <DashboardShell roles={["mahasiswa"]} title="Dashboard Mahasiswa">
      Peminjaman aktif, denda, dan riwayat akan dibangun di Hari 6-8.
    </DashboardShell>
  );
}
