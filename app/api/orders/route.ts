import { getCollection, toObjectId, normalizeDocs } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const db = (await import("@/lib/db")).getDb;
    const dbInstance = await db();

    const docs = await dbInstance.collection("orders").aggregate([
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

    return Response.json({ success: true, data: normalizeDocs(docs) });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id_pelanggan, id_lapangan, tanggal_pesan, jadwal_main, durasi, total_harga } = await request.json();

    const col = await getCollection("orders");
    const result = await col.insertOne({
      id_pelanggan: toObjectId(id_pelanggan),
      id_lapangan: toObjectId(id_lapangan),
      tanggal_pesan,
      jadwal_main,
      durasi,
      total_harga,
      status_order: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    });

    return Response.json({
      success: true,
      message: "Order created successfully",
      id: String(result.insertedId),
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
