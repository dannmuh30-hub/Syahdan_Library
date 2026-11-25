"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";
import { ROLE_HOME } from "@/lib/auth";
import { validateLogin, validateRegister } from "@/lib/validation";


const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8.7vNQoYHzTrVHaFjv0cC0vXqCk3He";

export async function registerAction(prevState, formData) {
  const { values, errors } = validateRegister(formData);
  const safeValues = { ...values, password: "", konfirmasi: "" };
  if (Object.keys(errors).length > 0) return { errors, values: safeValues };

  const passwordHash = await bcrypt.hash(values.password, 10);

  let user;
  try {
    const { rows } = await query(
      `INSERT INTO users (nama, email, password_hash, role, nomor_identitas)
       VALUES ($1, $2, $3, 'mahasiswa', $4)
       RETURNING id, role`,
      [values.nama, values.email, passwordHash, values.nomor_identitas]
    );
    user = rows[0];
  } catch (err) {
    if (err.code === "23505") {
      
      const field = String(err.constraint).includes("email") ? "email" : "nomor_identitas";
      const message = field === "email" ? "Email sudah terdaftar." : "NIM sudah terdaftar.";
      return { errors: { [field]: message }, values: safeValues };
    }
    throw err;
  }

  await createSession(user);
  redirect(ROLE_HOME.mahasiswa);
}

export async function loginAction(prevState, formData) {
  const { values, errors } = validateLogin(formData);
  if (Object.keys(errors).length > 0) return { errors, values: { email: values.email } };

  const { rows } = await query(
    "SELECT id, role, password_hash, is_active FROM users WHERE email = $1",
    [values.email]
  );
  const user = rows[0];
  const ok = await bcrypt.compare(values.password, user?.password_hash ?? DUMMY_HASH);

  if (!user || !ok) {
    return { errors: { form: "Email atau password salah." }, values: { email: values.email } };
  }
  if (!user.is_active) {
    return { errors: { form: "Akun dinonaktifkan. Hubungi admin perpustakaan." }, values: { email: values.email } };
  }

  await createSession(user);
  redirect(ROLE_HOME[user.role] ?? "/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
