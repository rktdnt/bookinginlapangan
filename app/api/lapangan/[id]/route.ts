import { query } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await query("SELECT * FROM lapangan WHERE id_lapangan = ?", [id]);
    if (result.length === 0) {
      return Response.json({ success: false, error: "Lapangan not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: result[0] });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { nama_lapangan, jenis_olahraga, lokasi, harga, status_ketersediaan, deskripsi, foto } = await request.json();

    await query(
      "UPDATE lapangan SET nama_lapangan = ?, jenis_olahraga = ?, lokasi = ?, harga = ?, status_ketersediaan = ?, deskripsi = ?, foto = ? WHERE id_lapangan = ?",
      [nama_lapangan, jenis_olahraga, lokasi, harga, status_ketersediaan, deskripsi, foto, id]
    );

    return Response.json({ success: true, message: "Lapangan updated successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query("DELETE FROM lapangan WHERE id_lapangan = ?", [id]);
    return Response.json({ success: true, message: "Lapangan deleted successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
