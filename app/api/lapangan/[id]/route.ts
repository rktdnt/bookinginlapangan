import { query } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await query("SELECT * FROM lapangan WHERE id_lapangan = ?", [id]);
    if (result.length === 0) {
      return Response.json({ success: false, error: "Lapangan not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: result[0] });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { nama_lapangan, jenis_olahraga, lokasi, harga, status_ketersediaan, deskripsi, foto } = await request.json();

    await query(
      "UPDATE lapangan SET nama_lapangan = ?, jenis_olahraga = ?, lokasi = ?, harga = ?, status_ketersediaan = ?, deskripsi = ?, foto = ? WHERE id_lapangan = ?",
      [nama_lapangan, jenis_olahraga, lokasi, harga, status_ketersediaan, deskripsi, foto, id]
    );

    return Response.json({ success: true, message: "Lapangan updated successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query("DELETE FROM lapangan WHERE id_lapangan = ?", [id]);
    return Response.json({ success: true, message: "Lapangan deleted successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
