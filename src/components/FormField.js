"use client";

import { useId, useState } from "react";

// Kembalikan key yang naik setiap ada hasil aksi baru. Dipakai sebagai key <form> agar form
// di-mount ulang dengan nilai terakhir; tanpa ini <select> kembali ke pilihan awal setelah error.
export function useFormKey(state) {
  const [prev, setPrev] = useState(state);
  const [key, setKey] = useState(0);
  if (prev !== state) {
    setPrev(state);
    setKey((k) => k + 1);
  }
  return key;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20";

export function Field({ label, name, type = "text", error, defaultValue, autoComplete, placeholder, hint, disabled }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        className={inputClass + (disabled ? " bg-stone-100 text-stone-500" : "")}
      />
      {hint && !error && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}

export function TextArea({ label, name, error, defaultValue, rows = 3 }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-700">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        aria-invalid={error ? "true" : undefined}
        className={inputClass}
      />
      {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}

export function SelectField({ label, name, error, defaultValue, options }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-700">
        {label}
      </label>
      <select id={id} name={name} defaultValue={defaultValue} aria-invalid={error ? "true" : undefined} className={inputClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}

export function SubmitButton({ pending, children }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-amber-800 px-4 py-2.5 font-medium text-white transition hover:bg-amber-900 disabled:opacity-60"
    >
      {pending ? "Menyimpan..." : children}
    </button>
  );
}
