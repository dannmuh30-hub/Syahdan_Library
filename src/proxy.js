import { NextResponse } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/token";

const ROLE_FOR_PREFIX = {
  "/admin": ["admin"],
  "/pegawai": ["pegawai", "admin"],
  "/mahasiswa": ["mahasiswa"],
};
const HOME = { admin: "/admin", pegawai: "/pegawai", mahasiswa: "/mahasiswa" };

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const prefix = Object.keys(ROLE_FOR_PREFIX).find(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!prefix) return NextResponse.next();

  const session = verifyToken(request.cookies.get(COOKIE_NAME)?.value);
  if (!session) return NextResponse.redirect(new URL("/login", request.url));
  if (!ROLE_FOR_PREFIX[prefix].includes(session.role)) {
    return NextResponse.redirect(new URL(HOME[session.role] ?? "/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/pegawai/:path*", "/mahasiswa/:path*"],
};
