import { query } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await query("SELECT * FROM pembayaran WHERE id_pembayaran = ?", [id]);
    if (result.length === 0) {
      return Response.json({ success: false, error: "Pembayaran not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: result[0] });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { status_pembayaran, metode_pembayaran, tanggal_bayar, jumlah_bayar } = await request.json();

    await query(
      "UPDATE pembayaran SET status_pembayaran = ?, metode_pembayaran = ?, tanggal_bayar = ?, jumlah_bayar = ? WHERE id_pembayaran = ?",
      [status_pembayaran, metode_pembayaran, tanggal_bayar, jumlah_bayar, id]
    );

    return Response.json({ success: true, message: "Pembayaran updated successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query("DELETE FROM pembayaran WHERE id_pembayaran = ?", [id]);
    return Response.json({ success: true, message: "Pembayaran deleted successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
