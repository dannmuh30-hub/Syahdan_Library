"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createBookAction, updateBookAction } from "@/app/actions/books";
import { Field, SelectField, SubmitButton, TextArea, useFormKey } from "@/components/FormField";


export default function BookForm({ book, categories, dipinjam = 0, prefill }) {
  const editing = Boolean(book);
  const [state, action, pending] = useActionState(editing ? updateBookAction : createBookAction, null);
  const formKey = useFormKey(state);
  const e = state?.errors ?? {};
  const v = state?.values ?? {
    judul: book?.judul ?? "",
    isbn: book?.isbn ?? "",
    pengarang: book?.pengarang ?? "",
    penerbit: book?.penerbit ?? "",
    tahun_terbit: book?.tahun_terbit ?? "",
    category_id: book?.category_id ?? categories[0]?.id ?? "",
    stok_total: book?.stok_total ?? "",
    durasi_maks_pinjam: book?.durasi_maks_pinjam ?? 7,
    denda_per_hari: book?.denda_per_hari ?? 1000,
    cover_url: book?.cover_url ?? "",
    deskripsi: book?.deskripsi ?? "",
    ...(prefill?.values ?? {}),
  };
  const requestId = state?.requestId ?? prefill?.requestId;
  return (
    <form key={formKey} action={action} className="max-w-2xl space-y-4" noValidate>
      {editing && <input type="hidden" name="id" value={book.id} />}
      {!editing && requestId && <input type="hidden" name="request_id" value={requestId} />}
      <Field label="Judul buku" name="judul" defaultValue={v.judul} error={e.judul} />
      {editing ? (
        <Field label="ISBN" name="isbn" defaultValue={book.isbn} disabled hint="ISBN tidak dapat diubah." />
      ) : (
        <Field label="ISBN" name="isbn" defaultValue={v.isbn} error={e.isbn} placeholder="978-602-0000-011" />
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pengarang" name="pengarang" defaultValue={v.pengarang} error={e.pengarang} />
        <Field label="Penerbit" name="penerbit" defaultValue={v.penerbit} error={e.penerbit} />
        <Field label="Tahun terbit" name="tahun_terbit" type="number" defaultValue={v.tahun_terbit} error={e.tahun_terbit} />
        <SelectField
          label="Kategori"
          name="category_id"
          defaultValue={String(v.category_id)}
          options={categories.map((c) => ({ value: String(c.id), label: c.nama }))}
          error={e.category_id}
        />
        <Field
          label="Jumlah stok"
          name="stok_total"
          type="number"
          defaultValue={v.stok_total}
          error={e.stok_total}
          hint={editing && dipinjam > 0 ? `Sedang dipinjam: ${dipinjam} eksemplar.` : undefined}
        />
        <Field label="Durasi maksimal pinjam (hari)" name="durasi_maks_pinjam" type="number" defaultValue={v.durasi_maks_pinjam} error={e.durasi_maks_pinjam} />
        <Field label="Tarif denda per hari (Rp)" name="denda_per_hari" type="number" defaultValue={v.denda_per_hari} error={e.denda_per_hari} />
      </div>
      <Field label="Tautan gambar sampul (opsional)" name="cover_url" defaultValue={v.cover_url} error={e.cover_url} placeholder="https://..." />
      <TextArea label="Deskripsi singkat (opsional)" name="deskripsi" rows={4} defaultValue={v.deskripsi} error={e.deskripsi} />
      <div className="flex items-center gap-3 pt-2">
        <SubmitButton pending={pending}>{editing ? "Simpan perubahan" : "Tambah buku"}</SubmitButton>
        <Link href="/pegawai/books" className="text-sm text-stone-600 hover:underline">
          Batal
        </Link>
      </div>
    </form>
  );
}
