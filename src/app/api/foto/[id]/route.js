import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { parseId } from "@/lib/validation";


export async function GET(request, { params }) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (!id || (user.id !== id && user.role !== "admin")) return new Response("Not found", { status: 404 });

  const { rows } = await query("SELECT foto_data, foto_tipe FROM users WHERE id = $1 AND foto_data IS NOT NULL", [id]);
  if (rows.length === 0) return new Response("Not found", { status: 404 });

  return new Response(rows[0].foto_data, {
    headers: {
      "Content-Type": rows[0].foto_tipe,
      "X-Content-Type-Options": "nosniff",
      
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
}
