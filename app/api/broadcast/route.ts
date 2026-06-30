import { getCollection, toObjectId, normalizeDocs } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const db = (await import("@/lib/db")).getDb;
    const dbInstance = await db();

    const docs = await dbInstance.collection("broadcast").aggregate([
      {
        $lookup: {
          from: "admin",
          localField: "id_admin",
          foreignField: "_id",
          as: "admin",
        },
      },
      { $unwind: { path: "$admin", preserveNullAndEmpty: true } },
      { $addFields: { nama: "$admin.nama" } },
      { $project: { admin: 0 } },
    ]).toArray();

    return Response.json({ success: true, data: normalizeDocs(docs) });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id_admin, judul, isi, tanggal_kirim, tipe_penerima } = await request.json();

    const col = await getCollection("broadcast");
    await col.insertOne({
      id_admin: toObjectId(id_admin),
      judul,
      isi,
      tanggal_kirim,
      tipe_penerima: tipe_penerima || "all",
      created_at: new Date(),
    });

    return Response.json({ success: true, message: "Broadcast created successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
