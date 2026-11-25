"use client";

import { useActionState, useState } from "react";
import { updateProfileAction, changePasswordAction, updatePhotoAction, removePhotoAction } from "@/app/actions/profile";
import Avatar from "@/components/Avatar";
import { Field, SubmitButton, useFormKey } from "@/components/FormField";

export function ProfileForm({ user }) {
  const [state, action, pending] = useActionState(updateProfileAction, null);
  const formKey = useFormKey(state);
  const e = state?.errors ?? {};
  const v = state?.values ?? { nama: user.nama, email: user.email };
  return (
    <form key={formKey} action={action} className="space-y-4" noValidate>
      <Field label="Nama lengkap" name="nama" defaultValue={v.nama} error={e.nama} autoComplete="name" />
      <Field
        label="Email"
        name="email"
        type="email"
        defaultValue={v.email}
        error={e.email}
        autoComplete="email"
        hint={user.role === "mahasiswa" ? "Gunakan email kampus (berakhiran .ac.id)." : undefined}
      />
      <Field label={user.role === "mahasiswa" ? "NIM" : "NIP"} name="nomor_identitas" defaultValue={user.nomor_identitas} disabled hint={user.role === "admin" ? undefined : "Tidak dapat diubah. Hubungi Admin bila ada kesalahan."} />
      <div className="pt-1">
        <SubmitButton pending={pending}>Simpan profil</SubmitButton>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, null);
  const formKey = useFormKey(state);
  const e = state?.errors ?? {};
  return (
    <form key={formKey} action={action} className="space-y-4" noValidate>
      <Field label="Password saat ini" name="lama" type="password" autoComplete="current-password" error={e.lama} />
      <Field label="Password baru (minimal 8 karakter)" name="baru" type="password" autoComplete="new-password" error={e.baru} />
      <Field label="Konfirmasi password baru" name="konfirmasi" type="password" autoComplete="new-password" error={e.konfirmasi} />
      <div className="pt-1">
        <SubmitButton pending={pending}>Ganti password</SubmitButton>
      </div>
    </form>
  );
}

export function PhotoForm({ user }) {
  const [state, action, pending] = useActionState(updatePhotoAction, null);
  const [preview, setPreview] = useState(null);

  const onPick = (e) => {
    const f = e.target.files?.[0];
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return f ? URL.createObjectURL(f) : null;
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {preview ? (
        
        <img src={preview} alt="Pratinjau foto baru" className="h-24 w-24 shrink-0 rounded-full object-cover" />
      ) : (
        <Avatar id={user.id} nama={user.nama} fotoV={user.fotoV} className="h-24 w-24 text-3xl" />
      )}
      <div className="min-w-0 flex-1">
        <form action={action} className="space-y-3">
          <div>
            <label htmlFor="foto" className="block text-sm font-medium text-stone-700">
              Pilih foto baru
            </label>
            <input
              id="foto"
              name="foto"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onPick}
              className="mt-1 block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-200 file:px-3 file:py-2 file:text-sm file:font-medium file:text-stone-800 hover:file:bg-stone-300"
            />
            <p className="mt-1 text-xs text-stone-500">JPG, PNG, atau WebP. Maksimal 2 MB.</p>
            {state?.error && <p role="alert" className="mt-1 text-sm text-red-700">{state.error}</p>}
          </div>
          <SubmitButton pending={pending}>Simpan foto</SubmitButton>
        </form>
        {user.fotoV && (
          <form action={removePhotoAction} className="mt-2">
            <button className="text-sm text-red-700 hover:underline">Hapus foto</button>
          </form>
        )}
      </div>
    </div>
  );
}
