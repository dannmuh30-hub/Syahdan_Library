import { LoginForm } from "@/components/AuthForms";

export const metadata = { title: "Masuk | Perpustakaan" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-900">Masuk ke Perpustakaan</h1>
      <p className="mb-6 mt-1 text-stone-600">Untuk Admin, Pegawai, dan Mahasiswa.</p>
      <LoginForm />
    </main>
  );
}
