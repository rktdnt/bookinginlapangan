import { query } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await query("SELECT * FROM review WHERE id_review = ?", [id]);
    if (result.length === 0) {
      return Response.json({ success: false, error: "Review not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: result[0] });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { rating, komentar } = await request.json();

    await query(
      "UPDATE review SET rating = ?, komentar = ? WHERE id_review = ?",
      [rating, komentar, id]
    );

    return Response.json({ success: true, message: "Review updated successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query("DELETE FROM review WHERE id_review = ?", [id]);
    return Response.json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
