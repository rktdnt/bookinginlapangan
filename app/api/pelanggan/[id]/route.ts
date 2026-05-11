import { query } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await query("SELECT * FROM pelanggan WHERE id_pelanggan = ?", [id]);
    if (result.length === 0) {
      return Response.json({ success: false, error: "Pelanggan not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: result[0] });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { nama, email, no_hp, alamat } = await request.json();

    await query(
      "UPDATE pelanggan SET nama = ?, email = ?, no_hp = ?, alamat = ? WHERE id_pelanggan = ?",
      [nama, email, no_hp, alamat, id]
    );

    return Response.json({ success: true, message: "Pelanggan updated successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query("DELETE FROM pelanggan WHERE id_pelanggan = ?", [id]);
    return Response.json({ success: true, message: "Pelanggan deleted successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
