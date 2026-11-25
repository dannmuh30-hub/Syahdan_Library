import Link from "next/link";


export default function StatCard({ label, value, href, tone = "default", hint }) {
  const toneCls =
    tone === "warn" ? "border-red-200 bg-red-50" : tone === "attn" ? "border-amber-300 bg-amber-50" : "border-stone-200";
  const body = (
    <>
      <p className="text-sm text-stone-600">{label}</p>
      <p className="mt-1 text-2xl font-bold text-stone-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-stone-500">{hint}</p>}
    </>
  );
  const cls = `block rounded-xl border p-4 ${toneCls}` + (href ? " hover:border-amber-800" : "");
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
