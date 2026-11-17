import { query } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await query(
      `SELECT
         (SELECT COUNT(*) FROM users)::int      AS users,
         (SELECT COUNT(*) FROM categories)::int AS categories,
         (SELECT COUNT(*) FROM books)::int      AS books`
    );
    return Response.json({ status: "ok", counts: rows[0] });
  } catch (err) {
    return Response.json({ status: "error", message: err.message }, { status: 500 });
  }
}
