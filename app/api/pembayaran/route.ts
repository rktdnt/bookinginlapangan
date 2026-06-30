import { getCollection, toObjectId, normalizeDocs } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const db = (await import("@/lib/db")).getDb;
    const dbInstance = await db();

    const docs = await dbInstance.collection("pembayaran").aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "id_order",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: { path: "$order", preserveNullAndEmpty: true } },
      {
        $addFields: {
          id_pelanggan: "$order.id_pelanggan",
          total_harga: "$order.total_harga",
        },
      },
      { $project: { order: 0 } },
    ]).toArray();

    return Response.json({ success: true, data: normalizeDocs(docs) });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id_order, metode_pembayaran, tanggal_bayar, jumlah_bayar, bukti_pembayaran } = await request.json();

    const col = await getCollection("pembayaran");
    await col.insertOne({
      id_order: toObjectId(id_order),
      metode_pembayaran,
      tanggal_bayar,
      status_pembayaran: "pending",
      jumlah_bayar,
      bukti_pembayaran,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return Response.json({ success: true, message: "Pembayaran created successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
