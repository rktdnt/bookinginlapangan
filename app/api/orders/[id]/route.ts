import { getCollection, toObjectId, normalizeDoc } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) return Response.json({ success: false, error: "Invalid id" }, { status: 400 });

    const db = (await import("@/lib/db")).getDb;
    const dbInstance = await db();

    const docs = await dbInstance.collection("orders").aggregate([
      { $match: { _id: oid } },
      {
        $lookup: {
          from: "lapangan",
          localField: "id_lapangan",
          foreignField: "_id",
          as: "lapangan",
        },
      },
      { $unwind: { path: "$lapangan", preserveNullAndEmpty: true } },
      {
        $lookup: {
          from: "pelanggan",
          localField: "id_pelanggan",
          foreignField: "_id",
          as: "pelanggan",
        },
      },
      { $unwind: { path: "$pelanggan", preserveNullAndEmpty: true } },
      {
        $addFields: {
          nama_lapangan: "$lapangan.nama_lapangan",
          nama: "$pelanggan.nama",
        },
      },
      { $project: { lapangan: 0, pelanggan: 0 } },
    ]).toArray();

    if (!docs[0]) return Response.json({ success: false, error: "Order not found" }, { status: 404 });
    return Response.json({ success: true, data: normalizeDoc(docs[0]) });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) return Response.json({ success: false, error: "Invalid id" }, { status: 400 });

    const { status_order } = await request.json();
    const col = await getCollection("orders");
    await col.updateOne({ _id: oid }, { $set: { status_order, updated_at: new Date() } });
    return Response.json({ success: true, message: "Order updated successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) return Response.json({ success: false, error: "Invalid id" }, { status: 400 });

    const col = await getCollection("orders");
    await col.deleteOne({ _id: oid });
    return Response.json({ success: true, message: "Order deleted successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
