import { getCollection, normalizeDocs } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const col = await getCollection("pelanggan");
    const docs = await col.find({}).toArray();
    return Response.json({ success: true, data: normalizeDocs(docs) });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nama, email, password, no_hp, alamat } = await request.json();
    const { hashPassword } = await import("@/lib/auth");
    const hashedPassword = hashPassword(password);

    const col = await getCollection("pelanggan");
    await col.insertOne({
      nama,
      email,
      password: hashedPassword,
      no_hp,
      alamat,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return Response.json({ success: true, message: "Pelanggan created successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
