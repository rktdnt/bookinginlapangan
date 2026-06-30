import { getCollection, toObjectId, normalizeDoc } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) return Response.json({ success: false, error: "Invalid id" }, { status: 400 });

    const col = await getCollection("pelanggan");
    const doc = await col.findOne({ _id: oid });
    if (!doc) return Response.json({ success: false, error: "Pelanggan not found" }, { status: 404 });
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

    const { nama, email, no_hp, alamat } = await request.json();
    const col = await getCollection("pelanggan");
    await col.updateOne({ _id: oid }, { $set: { nama, email, no_hp, alamat, updated_at: new Date() } });
    return Response.json({ success: true, message: "Pelanggan updated successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) return Response.json({ success: false, error: "Invalid id" }, { status: 400 });

    const col = await getCollection("pelanggan");
    await col.deleteOne({ _id: oid });
    return Response.json({ success: true, message: "Pelanggan deleted successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
