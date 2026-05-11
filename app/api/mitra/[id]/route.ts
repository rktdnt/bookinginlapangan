import { query } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await query("SELECT * FROM mitra WHERE id_mitra = ?", [id]);
    if (result.length === 0) {
      return Response.json({ success: false, error: "Mitra not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: result[0] });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { nama_mitra, alamat, no_hp, email, status } = await request.json();

    await query(
      "UPDATE mitra SET nama_mitra = ?, alamat = ?, no_hp = ?, email = ?, status = ? WHERE id_mitra = ?",
      [nama_mitra, alamat, no_hp, email, status, id]
    );

    return Response.json({ success: true, message: "Mitra updated successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query("DELETE FROM mitra WHERE id_mitra = ?", [id]);
    return Response.json({ success: true, message: "Mitra deleted successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
