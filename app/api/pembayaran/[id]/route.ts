import { getCollection, toObjectId, normalizeDoc } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) return Response.json({ success: false, error: "Invalid id" }, { status: 400 });

    const col = await getCollection("pembayaran");
    const doc = await col.findOne({ _id: oid });
    if (!doc) return Response.json({ success: false, error: "Pembayaran not found" }, { status: 404 });
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

    const { status_pembayaran, metode_pembayaran, tanggal_bayar, jumlah_bayar } = await request.json();
    const col = await getCollection("pembayaran");
    await col.updateOne(
      { _id: oid },
      { $set: { status_pembayaran, metode_pembayaran, tanggal_bayar, jumlah_bayar, updated_at: new Date() } }
    );
    return Response.json({ success: true, message: "Pembayaran updated successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) return Response.json({ success: false, error: "Invalid id" }, { status: 400 });

    const col = await getCollection("pembayaran");
    await col.deleteOne({ _id: oid });
    return Response.json({ success: true, message: "Pembayaran deleted successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
