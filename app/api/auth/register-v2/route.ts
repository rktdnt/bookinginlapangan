import { getCollection } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userType, email, password, ...data } = await request.json();

    const now = new Date();

    if (userType === "mitra") {
      const col = await getCollection("mitra");
      const existing = await col.findOne({ email });
      if (existing) {
        return Response.json({ success: false, error: "Email already exists" }, { status: 400 });
      }
      await col.insertOne({
        nama_mitra: data.nama_mitra,
        email,
        password: hashPassword(password),
        no_hp: data.no_hp,
        alamat: data.alamat,
        status: "active",
        created_at: now,
        updated_at: now,
      });
    } else if (userType === "pelanggan") {
      const col = await getCollection("pelanggan");
      const existing = await col.findOne({ email });
      if (existing) {
        return Response.json({ success: false, error: "Email already exists" }, { status: 400 });
      }
      await col.insertOne({
        nama: data.nama,
        email,
        password: hashPassword(password),
        no_hp: data.no_hp,
        alamat: data.alamat,
        created_at: now,
        updated_at: now,
      });
    } else if (userType === "admin") {
      const col = await getCollection("admin");
      const existing = await col.findOne({ email });
      if (existing) {
        return Response.json({ success: false, error: "Email already exists" }, { status: 400 });
      }
      await col.insertOne({
        nama: data.nama,
        email,
        password: hashPassword(password),
        no_hp: data.no_hp,
        created_at: now,
        updated_at: now,
      });
    } else {
      return Response.json({ success: false, error: "Invalid userType" }, { status: 400 });
    }

    return Response.json({ success: true, message: "Registration successful" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
