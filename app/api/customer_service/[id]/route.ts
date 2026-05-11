import { query } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await query("SELECT * FROM customer_service WHERE id_cs = ?", [id]);
    if (result.length === 0) {
      return Response.json({ success: false, error: "Customer service not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: result[0] });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { status_keluhan, respons_admin, tanggal_respons } = await request.json();

    await query(
      "UPDATE customer_service SET status_keluhan = ?, respons_admin = ?, tanggal_respons = ? WHERE id_cs = ?",
      [status_keluhan, respons_admin, tanggal_respons, id]
    );

    return Response.json({ success: true, message: "Customer service updated successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query("DELETE FROM customer_service WHERE id_cs = ?", [id]);
    return Response.json({ success: true, message: "Customer service deleted successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
