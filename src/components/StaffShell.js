import RoleShell from "@/components/RoleShell";


export default function StaffShell(props) {
  return <RoleShell roles={["pegawai", "admin"]} {...props} />;
}
