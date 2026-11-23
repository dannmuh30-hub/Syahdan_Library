"use client";

import { useActionState } from "react";
import { createRequestAction } from "@/app/actions/requests";
import { Field, SubmitButton, TextArea, useFormKey } from "@/components/FormField";

export default function RequestForm() {
  const [state, action, pending] = useActionState(createRequestAction, null);
  const formKey = useFormKey(state);
  const e = state?.errors ?? {};
  const v = state?.values ?? { judul: "", pengarang: "", penerbit: "", tahun_terbit: "", alasan: "" };
  return (
    <form key={formKey} action={action} className="max-w-xl space-y-4" noValidate>
      <Field label="Judul buku" name="judul" defaultValue={v.judul} error={e.judul} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pengarang" name="pengarang" defaultValue={v.pengarang} error={e.pengarang} />
        <Field label="Penerbit (opsional)" name="penerbit" defaultValue={v.penerbit} error={e.penerbit} />
        <Field label="Tahun terbit (opsional)" name="tahun_terbit" type="number" defaultValue={v.tahun_terbit} error={e.tahun_terbit} />
      </div>
      <TextArea label="Alasan (opsional)" name="alasan" rows={3} defaultValue={v.alasan} error={e.alasan} />
      <SubmitButton pending={pending}>Kirim request</SubmitButton>
    </form>
  );
}
