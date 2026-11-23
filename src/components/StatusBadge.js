const STYLE = {
  "Menunggu Konfirmasi": "bg-amber-100 text-amber-800",
  "Sedang Dipinjam": "bg-sky-100 text-sky-800",
  Selesai: "bg-green-100 text-green-800",
  Ditolak: "bg-red-100 text-red-800",
  Menunggu: "bg-amber-100 text-amber-800",
  Disetujui: "bg-sky-100 text-sky-800",
  Ditambahkan: "bg-green-100 text-green-800",
};

export default function StatusBadge({ status }) {
  return <span className={"inline-block rounded-full px-2 py-0.5 text-xs font-medium " + (STYLE[status] ?? "bg-stone-100 text-stone-700")}>{status}</span>;
}
