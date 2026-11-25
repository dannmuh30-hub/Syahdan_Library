


const ADMIN = [
  {
    label: "Utama",
    items: [{ href: "/admin", label: "Dashboard", icon: "home", exact: true }],
  },
  {
    label: "Data Master",
    items: [
      { href: "/admin/users", label: "User", icon: "users" },
      { href: "/admin/categories", label: "Kategori", icon: "tag" },
      { href: "/admin/requests", label: "Request Buku", icon: "inbox" },
      { href: "/admin/transactions", label: "Transaksi", icon: "receipt" },
    ],
  },
  {
    label: "Operasional",
    items: [
      { href: "/pegawai/loans", label: "Peminjaman", icon: "swap" },
      { href: "/pegawai/books", label: "Buku", icon: "book" },
      { href: "/pegawai/announcements", label: "Pengumuman", icon: "megaphone" },
    ],
  },
  {
    label: "Akun",
    items: [
      { href: "/profil", label: "Profil Saya", icon: "user" },
    ],
  },
];

const PEGAWAI = [
  {
    label: "Utama",
    items: [{ href: "/pegawai", label: "Dashboard", icon: "home", exact: true }],
  },
  {
    label: "Operasional",
    items: [
      { href: "/pegawai/loans", label: "Peminjaman", icon: "swap" },
      { href: "/pegawai/books", label: "Buku", icon: "book" },
      { href: "/pegawai/announcements", label: "Pengumuman", icon: "megaphone" },
    ],
  },
  {
    label: "Lainnya",
    items: [
      { href: "/katalog", label: "Lihat Katalog", icon: "grid" },
      { href: "/profil", label: "Profil Saya", icon: "user" },
    ],
  },
];

const MAHASISWA = [
  {
    label: "Utama",
    items: [{ href: "/mahasiswa", label: "Dashboard", icon: "home", exact: true }],
  },
  {
    label: "Perpustakaan",
    items: [
      { href: "/mahasiswa/loans", label: "Peminjaman Saya", icon: "swap" },
      { href: "/mahasiswa/requests", label: "Request Buku", icon: "inbox" },
      { href: "/katalog", label: "Katalog", icon: "grid" },
      { href: "/pengumuman", label: "Pengumuman", icon: "megaphone" },
    ],
  },
  {
    label: "Akun",
    items: [{ href: "/profil", label: "Profil Saya", icon: "user" }],
  },
];

export const ROLE_LABEL = { admin: "Admin", pegawai: "Pegawai", mahasiswa: "Mahasiswa" };

export function navFor(role) {
  if (role === "admin") return ADMIN;
  if (role === "pegawai") return PEGAWAI;
  return MAHASISWA;
}
