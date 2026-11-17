import DashboardShell from "@/components/DashboardShell";

export const metadata = { title: "Dashboard Admin" };

export default function AdminPage() {
  return (
    <DashboardShell roles={["admin"]} title="Dashboard Admin">
      Statistik dan navigasi User/Category Management akan dibangun di Hari 3 dan 8.
    </DashboardShell>
  );
}
