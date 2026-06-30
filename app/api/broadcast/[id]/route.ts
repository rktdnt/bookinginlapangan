import { getCollection, toObjectId, normalizeDoc } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) return Response.json({ success: false, error: "Invalid id" }, { status: 400 });

    const col = await getCollection("broadcast");
    const doc = await col.findOne({ _id: oid });
    if (!doc) return Response.json({ success: false, error: "Broadcast not found" }, { status: 404 });
    return Response.json({ success: true, data: normalizeDoc(doc) });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) return Response.json({ success: false, error: "Invalid id" }, { status: 400 });

    const { judul, isi, tanggal_kirim, tipe_penerima } = await request.json();
    const col = await getCollection("broadcast");
    await col.updateOne(
      { _id: oid },
      { $set: { judul, isi, tanggal_kirim, tipe_penerima, updated_at: new Date() } }
    );
    return Response.json({ success: true, message: "Broadcast updated successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) return Response.json({ success: false, error: "Invalid id" }, { status: 400 });

    const col = await getCollection("broadcast");
    await col.deleteOne({ _id: oid });
    return Response.json({ success: true, message: "Broadcast deleted successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
