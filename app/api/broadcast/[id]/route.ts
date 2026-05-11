import { query } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await query("SELECT * FROM broadcast WHERE id_broadcast = ?", [id]);
    if (result.length === 0) {
      return Response.json({ success: false, error: "Broadcast not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: result[0] });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { judul, isi, tanggal_kirim, tipe_penerima } = await request.json();

    await query(
      "UPDATE broadcast SET judul = ?, isi = ?, tanggal_kirim = ?, tipe_penerima = ? WHERE id_broadcast = ?",
      [judul, isi, tanggal_kirim, tipe_penerima, id]
    );

    return Response.json({ success: true, message: "Broadcast updated successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query("DELETE FROM broadcast WHERE id_broadcast = ?", [id]);
    return Response.json({ success: true, message: "Broadcast deleted successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
