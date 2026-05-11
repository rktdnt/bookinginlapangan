import { query } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await query(
      "SELECT o.*, l.nama_lapangan, p.nama FROM orders o JOIN lapangan l ON o.id_lapangan = l.id_lapangan JOIN pelanggan p ON o.id_pelanggan = p.id_pelanggan WHERE o.id_order = ?",
      [id]
    );
    if (result.length === 0) {
      return Response.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: result[0] });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { status_order } = await request.json();

    await query(
      "UPDATE orders SET status_order = ? WHERE id_order = ?",
      [status_order, id]
    );

    return Response.json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query("DELETE FROM orders WHERE id_order = ?", [id]);
    return Response.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
