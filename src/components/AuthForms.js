"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction } from "@/app/actions/auth";
import { Field, useFormKey } from "@/components/FormField";

function SubmitButton({ pending, children }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-amber-800 px-4 py-2.5 font-medium text-white transition hover:bg-amber-900 disabled:opacity-60"
    >
      {pending ? "Memproses..." : children}
    </button>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  const formKey = useFormKey(state);
  const errors = state?.errors ?? {};
  return (
    <form key={formKey} action={action} className="space-y-4" noValidate>
      {errors.form && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.form}
        </p>
      )}
      <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={state?.values?.email} error={errors.email} />
      <Field label="Password" name="password" type="password" autoComplete="current-password" error={errors.password} />
      <SubmitButton pending={pending}>Masuk</SubmitButton>
      <p className="text-center text-sm text-stone-600">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-amber-800 underline">
          Daftar sebagai Mahasiswa
        </Link>
      </p>
      <Link
        href="/"
        className="block w-full rounded-lg border border-stone-300 px-4 py-2.5 text-center font-medium text-stone-700 hover:bg-stone-100"
      >
        Continue as Guest
      </Link>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, null);
  const formKey = useFormKey(state);
  const errors = state?.errors ?? {};
  const v = state?.values ?? {};
  return (
    <form key={formKey} action={action} className="space-y-4" noValidate>
      <Field label="Nama lengkap" name="nama" autoComplete="name" defaultValue={v.nama} error={errors.nama} />
      <Field label="Email kampus" name="email" type="email" autoComplete="email" placeholder="namaanda@student.unhas.ac.id" defaultValue={v.email} error={errors.email} />
      <Field label="NIM" name="nomor_identitas" defaultValue={v.nomor_identitas} error={errors.nomor_identitas} />
      <Field label="Password (minimal 8 karakter)" name="password" type="password" autoComplete="new-password" error={errors.password} />
      <Field label="Konfirmasi password" name="konfirmasi" type="password" autoComplete="new-password" error={errors.konfirmasi} />
      <SubmitButton pending={pending}>Daftar</SubmitButton>
      <p className="text-center text-sm text-stone-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-amber-800 underline">
          Masuk
        </Link>
      </p>
    </form>
  );
}
