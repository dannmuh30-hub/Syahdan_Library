"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createAnnouncementAction, updateAnnouncementAction } from "@/app/actions/announcements";
import { Field, SelectField, SubmitButton, TextArea, useFormKey } from "@/components/FormField";

const KATEGORI = ["Operasional", "Layanan", "Acara"].map((k) => ({ value: k, label: k }));
const STATUS = [
  { value: "Draft", label: "Draft (belum tampil publik)" },
  { value: "Published", label: "Published (tampil publik)" },
];


export default function AnnouncementForm({ announcement, defaultDate }) {
  const editing = Boolean(announcement);
  const [state, action, pending] = useActionState(editing ? updateAnnouncementAction : createAnnouncementAction, null);
  const formKey = useFormKey(state);
  const e = state?.errors ?? {};
  const v = state?.values ?? {
    judul: announcement?.judul ?? "",
    konten: announcement?.konten ?? "",
    kategori: announcement?.kategori ?? "Operasional",
    tanggal_rilis: announcement?.tanggal_rilis_iso ?? defaultDate ?? "",
    status: announcement?.status ?? "Draft",
  };
  return (
    <form key={formKey} action={action} className="max-w-2xl space-y-4" noValidate>
      {editing && <input type="hidden" name="id" value={announcement.id} />}
      <Field label="Judul pengumuman" name="judul" defaultValue={v.judul} error={e.judul} />
      <TextArea label="Isi pengumuman" name="konten" rows={8} defaultValue={v.konten} error={e.konten} />
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label="Kategori" name="kategori" defaultValue={v.kategori} options={KATEGORI} error={e.kategori} />
        <Field label="Tanggal rilis" name="tanggal_rilis" type="date" defaultValue={v.tanggal_rilis} error={e.tanggal_rilis} />
        <SelectField label="Status publikasi" name="status" defaultValue={v.status} options={STATUS} error={e.status} />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <SubmitButton pending={pending}>{editing ? "Simpan perubahan" : "Tambah pengumuman"}</SubmitButton>
        <Link href="/pegawai/announcements" className="text-sm text-stone-600 hover:underline">
          Batal
        </Link>
      </div>
    </form>
  );
}
