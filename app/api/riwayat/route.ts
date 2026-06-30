import { getCollection, toObjectId, normalizeDocs } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const db = (await import("@/lib/db")).getDb;
    const dbInstance = await db();

    const docs = await dbInstance.collection("riwayat").aggregate([
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
        $lookup: {
          from: "lapangan",
          localField: "order.id_lapangan",
          foreignField: "_id",
          as: "lapangan",
        },
      },
      { $unwind: { path: "$lapangan", preserveNullAndEmpty: true } },
      {
        $addFields: {
          id_pelanggan: "$order.id_pelanggan",
          nama_lapangan: "$lapangan.nama_lapangan",
        },
      },
      { $project: { order: 0, lapangan: 0 } },
    ]).toArray();

    return Response.json({ success: true, data: normalizeDocs(docs) });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id_order, status_akhir, tanggal_selesai, catatan } = await request.json();

    const col = await getCollection("riwayat");
    await col.insertOne({
      id_order: toObjectId(id_order),
      status_akhir,
      tanggal_selesai,
      catatan,
      created_at: new Date(),
    });

    return Response.json({ success: true, message: "Riwayat created successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
