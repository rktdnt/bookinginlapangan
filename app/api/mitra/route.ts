import { query } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const mitra = await query("SELECT * FROM mitra");
    return Response.json({ success: true, data: mitra });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nama_mitra, alamat, no_hp, email, password } = await request.json();
    const { hashPassword } = await import("@/lib/auth");
    const hashedPassword = hashPassword(password);

    await query(
      "INSERT INTO mitra (nama_mitra, alamat, no_hp, email, password) VALUES (?, ?, ?, ?, ?)",
      [nama_mitra, alamat, no_hp, email, hashedPassword]
    );

    return Response.json({ success: true, message: "Mitra created successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
