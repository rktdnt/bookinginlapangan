import { getCollection, normalizeDocs, toObjectId } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const col = await getCollection("lapangan");
    const docs = await col.find({}).toArray();
    return Response.json({ success: true, data: normalizeDocs(docs) });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id_mitra, nama_lapangan, jenis_olahraga, lokasi, harga, status_ketersediaan, deskripsi, foto } = await request.json();

    const col = await getCollection("lapangan");
    await col.insertOne({
      id_mitra: toObjectId(id_mitra),
      nama_lapangan,
      jenis_olahraga,
      lokasi,
      harga,
      status_ketersediaan: status_ketersediaan || "available",
      deskripsi,
      foto,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return Response.json({ success: true, message: "Lapangan created successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
