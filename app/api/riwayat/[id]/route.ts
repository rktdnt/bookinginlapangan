import { query } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await query("SELECT * FROM riwayat WHERE id_riwayat = ?", [id]);
    if (result.length === 0) {
      return Response.json({ success: false, error: "Riwayat not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: result[0] });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status_akhir, tanggal_selesai, catatan } = await request.json();

    await query(
      "UPDATE riwayat SET status_akhir = ?, tanggal_selesai = ?, catatan = ? WHERE id_riwayat = ?",
      [status_akhir, tanggal_selesai, catatan, id]
    );

    return Response.json({ success: true, message: "Riwayat updated successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query("DELETE FROM riwayat WHERE id_riwayat = ?", [id]);
    return Response.json({ success: true, message: "Riwayat deleted successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
