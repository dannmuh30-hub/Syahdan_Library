"use client";

export default function DeleteForm({ action, id, confirmText }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm font-medium text-red-700 hover:underline">
        Hapus
      </button>
    </form>
  );
}
