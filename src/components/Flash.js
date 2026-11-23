export default function Flash({ ok, err, messages }) {
  const okText = ok && messages.ok[ok];
  const errText = err && messages.err[err];
  if (!okText && !errText) return null;
  return (
    <p
      role="status"
      className={
        "mb-4 rounded-lg px-3 py-2 text-sm " +
        (errText ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800")
      }
    >
      {errText || okText}
    </p>
  );
}
