"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createUserAction, updateUserAction, createCategoryAction, updateCategoryAction } from "@/app/actions/admin";
import { Field, TextArea, SelectField, SubmitButton, useFormKey } from "@/components/FormField";

const ROLE_OPTIONS = [
  { value: "mahasiswa", label: "Mahasiswa" },
  { value: "pegawai", label: "Pegawai Perpustakaan" },
  { value: "admin", label: "Admin" },
];
const STATUS_OPTIONS = [
  { value: "true", label: "Aktif" },
  { value: "false", label: "Nonaktif" },
];

function FormError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  );
}

function Actions({ pending, cancelHref, children }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <SubmitButton pending={pending}>{children}</SubmitButton>
      <Link href={cancelHref} className="text-sm text-stone-600 hover:underline">
        Batal
      </Link>
    </div>
  );
}

// user: undefined saat membuat, atau baris users saat mengedit
export function UserForm({ user }) {
  const editing = Boolean(user);
  const [state, action, pending] = useActionState(editing ? updateUserAction : createUserAction, null);
  const formKey = useFormKey(state);
  const e = state?.errors ?? {};
  const v = state?.values ?? {
    nama: user?.nama ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "mahasiswa",
    nomor_identitas: user?.nomor_identitas ?? "",
    is_active: user?.is_active ?? true,
  };
  return (
    <form key={formKey} action={action} className="max-w-lg space-y-4" noValidate>
      <FormError message={e.form} />
      {editing && <input type="hidden" name="id" value={user.id} />}
      <Field label="Nama lengkap" name="nama" defaultValue={v.nama} error={e.nama} />
      <Field label="Email" name="email" type="email" defaultValue={v.email} error={e.email} />
      {editing ? (
        <Field label="Nomor identitas (NIM/NIP)" name="nomor_identitas" defaultValue={user.nomor_identitas} disabled hint="Nomor identitas tidak dapat diubah." />
      ) : (
        <>
          <Field label="Nomor identitas (NIM/NIP)" name="nomor_identitas" defaultValue={v.nomor_identitas} error={e.nomor_identitas} />
          <Field label="Password (minimal 8 karakter)" name="password" type="password" autoComplete="new-password" error={e.password} />
        </>
      )}
      <SelectField label="Role" name="role" defaultValue={v.role} options={ROLE_OPTIONS} error={e.role} />
      {editing && (
        <SelectField label="Status akun" name="is_active" defaultValue={String(v.is_active)} options={STATUS_OPTIONS} />
      )}
      <Actions pending={pending} cancelHref="/admin/users">
        {editing ? "Simpan perubahan" : "Tambah user"}
      </Actions>
    </form>
  );
}

// category: undefined saat membuat, atau baris categories saat mengedit
export function CategoryForm({ category }) {
  const editing = Boolean(category);
  const [state, action, pending] = useActionState(editing ? updateCategoryAction : createCategoryAction, null);
  const formKey = useFormKey(state);
  const e = state?.errors ?? {};
  const v = state?.values ?? {
    nama: category?.nama ?? "",
    kode: category?.kode ?? "",
    deskripsi: category?.deskripsi ?? "",
  };
  return (
    <form key={formKey} action={action} className="max-w-lg space-y-4" noValidate>
      {editing && <input type="hidden" name="id" value={category.id} />}
      <Field label="Nama kategori" name="nama" defaultValue={v.nama} error={e.nama} />
      <Field label="Kode klasifikasi" name="kode" defaultValue={v.kode} error={e.kode} placeholder="contoh: TI-004" />
      <TextArea label="Deskripsi singkat (opsional)" name="deskripsi" defaultValue={v.deskripsi} error={e.deskripsi} />
      <Actions pending={pending} cancelHref="/admin/categories">
        {editing ? "Simpan perubahan" : "Tambah kategori"}
      </Actions>
    </form>
  );
}
