import { LoginForm } from "@/components/AuthForms";
import BrandLogo from "@/components/BrandLogo";

export const metadata = { title: "Masuk | Nongkread" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-3 flex items-center gap-2.5">
        <BrandLogo size={36} />
        <h1 className="text-2xl font-bold text-stone-900">Masuk ke Nongkread</h1>
      </div>
      <p className="mb-6 mt-1 text-stone-600">Untuk Admin, Pegawai, dan Mahasiswa.</p>
      <LoginForm />
    </main>
  );
}
