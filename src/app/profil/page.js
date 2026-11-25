import RoleShell from "@/components/RoleShell";
import Flash from "@/components/Flash";
import { ProfileForm, PasswordForm, PhotoForm } from "@/components/ProfileForms";
import Avatar from "@/components/Avatar";
import { ROLE_LABEL } from "@/lib/nav";

export const metadata = { title: "Profil Saya" };

const MESSAGES = {
  ok: {
    profil: "Profil berhasil diperbarui.",
    password: "Password berhasil diganti.",
    foto: "Foto profil berhasil diganti.",
    fotohapus: "Foto profil dihapus.",
  },
  err: {},
};

async function ProfileContent({ user, searchParams }) {
  const sp = await searchParams;
  return (
    <>
      <Flash ok={sp.ok} err={sp.err} messages={MESSAGES} />
      <div className="space-y-6">
        <section className="rounded-xl border border-stone-200 bg-stone-50 p-5" aria-labelledby="foto-profil">
          <h2 id="foto-profil" className="mb-4 text-lg font-semibold text-stone-900">Foto profil</h2>
          <PhotoForm user={{ id: user.id, nama: user.nama, fotoV: user.foto_v }} />
        </section>

        <section className="rounded-xl border border-stone-200 bg-stone-50 p-5" aria-labelledby="data-diri">
          <div className="mb-4 flex items-center gap-3">
            <Avatar id={user.id} nama={user.nama} fotoV={user.foto_v} className="h-12 w-12 text-lg" />
            <div>
              <h2 id="data-diri" className="text-lg font-semibold text-stone-900">Data diri</h2>
              <p className="text-sm text-stone-500">Peran: {ROLE_LABEL[user.role] ?? user.role}</p>
            </div>
          </div>
          <ProfileForm user={user} />
        </section>

        <section className="rounded-xl border border-stone-200 bg-stone-50 p-5" aria-labelledby="ganti-password">
          <h2 id="ganti-password" className="mb-4 text-lg font-semibold text-stone-900">Ganti password</h2>
          <PasswordForm />
        </section>
      </div>
    </>
  );
}

export default function ProfilPage({ searchParams }) {
  return (
    <RoleShell roles={["admin", "pegawai", "mahasiswa"]} title="Profil Saya" width="max-w-2xl">
      {(user) => <ProfileContent user={user} searchParams={searchParams} />}
    </RoleShell>
  );
}
