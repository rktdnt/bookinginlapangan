import { query } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await query("SELECT * FROM admin WHERE id_admin = ?", [id]);
    if (result.length === 0) {
      return Response.json({ success: false, error: "Admin not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: result[0] });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { nama, email, no_hp } = await request.json();

    await query(
      "UPDATE admin SET nama = ?, email = ?, no_hp = ? WHERE id_admin = ?",
      [nama, email, no_hp, id]
    );

    return Response.json({ success: true, message: "Admin updated successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query("DELETE FROM admin WHERE id_admin = ?", [id]);
    return Response.json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
