"use client";

import { useId, useState } from "react";



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
  const [shown, setShown] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={isPassword && shown ? "text" : type}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          className={inputClass + (disabled ? " bg-stone-100 text-stone-500" : "") + (isPassword ? " pr-11" : "")}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? "Sembunyikan password" : "Tampilkan password"}
            aria-pressed={shown}
            className="absolute inset-y-0 right-0 mt-1 flex w-11 items-center justify-center text-stone-500 hover:text-stone-800"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              {shown ? (
                <>
                  <path d="M3 3l18 18" />
                  <path d="M10.6 6.1A10.5 10.5 0 0112 6c5 0 9 4.5 10 6-.5.8-1.6 2.1-3.1 3.3M6.5 7.6C4.5 9 3 11 2 12c1 1.5 5 6 10 6 1.4 0 2.7-.3 3.9-.8" />
                  <path d="M9.9 9.9a3 3 0 004.2 4.2" />
                </>
              ) : (
                <>
                  <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>
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
