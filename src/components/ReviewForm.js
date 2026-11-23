"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createReviewAction } from "@/app/actions/reviews";
import { SelectField, SubmitButton, TextArea, useFormKey } from "@/components/FormField";

const RATING = [
  { value: "", label: "Pilih rating..." },
  { value: "5", label: "5 - Sangat bagus" },
  { value: "4", label: "4 - Bagus" },
  { value: "3", label: "3 - Cukup" },
  { value: "2", label: "2 - Kurang" },
  { value: "1", label: "1 - Buruk" },
];

export default function ReviewForm({ loanId }) {
  const [state, action, pending] = useActionState(createReviewAction, null);
  const formKey = useFormKey(state);
  const e = state?.errors ?? {};
  const v = state?.values ?? { rating: "", komentar: "" };
  return (
    <form key={formKey} action={action} className="max-w-xl space-y-4" noValidate>
      <input type="hidden" name="loan_id" value={loanId} />
      <SelectField label="Rating" name="rating" defaultValue={v.rating} options={RATING} error={e.rating} />
      <TextArea label="Ulasan" name="komentar" rows={5} defaultValue={v.komentar} error={e.komentar} />
      <div className="flex items-center gap-3 pt-1">
        <SubmitButton pending={pending}>Kirim ulasan</SubmitButton>
        <Link href="/mahasiswa/loans" className="text-sm text-stone-600 hover:underline">
          Batal
        </Link>
      </div>
    </form>
  );
}
