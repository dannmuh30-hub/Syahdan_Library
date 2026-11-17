import { RegisterForm } from "@/components/AuthForms";

export const metadata = { title: "Daftar | Perpustakaan" };

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-900">Daftar Akun Mahasiswa</h1>
      <p className="mb-6 mt-1 text-stone-600">Gunakan email kampus (.ac.id) dan NIM kamu.</p>
      <RegisterForm />
    </main>
  );
}
