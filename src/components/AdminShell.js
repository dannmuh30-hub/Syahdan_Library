import RoleShell from "@/components/RoleShell";


export default function AdminShell(props) {
  return <RoleShell roles={["admin"]} {...props} />;
}
