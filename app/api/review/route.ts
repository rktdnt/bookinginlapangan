import { getCollection, toObjectId, normalizeDocs } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const db = (await import("@/lib/db")).getDb;
    const dbInstance = await db();

    const docs = await dbInstance.collection("review").aggregate([
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
        $lookup: {
          from: "mitra",
          localField: "id_mitra",
          foreignField: "_id",
          as: "mitra",
        },
      },
      { $unwind: { path: "$mitra", preserveNullAndEmpty: true } },
      {
        $addFields: {
          nama_pelanggan: "$pelanggan.nama",
          nama_mitra: "$mitra.nama_mitra",
        },
      },
      { $project: { pelanggan: 0, mitra: 0 } },
    ]).toArray();

    return Response.json({ success: true, data: normalizeDocs(docs) });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id_pelanggan, id_mitra, rating, komentar, tanggal_review } = await request.json();

    const col = await getCollection("review");
    await col.insertOne({
      id_pelanggan: toObjectId(id_pelanggan),
      id_mitra: toObjectId(id_mitra),
      rating,
      komentar,
      tanggal_review,
      created_at: new Date(),
    });

    return Response.json({ success: true, message: "Review created successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
