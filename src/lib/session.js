import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { COOKIE_NAME, signToken, verifyToken } from "@/lib/token";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function createSession(user) {
  const token = signToken({
    uid: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  });
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  await connection();
  return verifyToken(token);
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}
