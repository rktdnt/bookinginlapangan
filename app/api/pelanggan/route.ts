import { query } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const pelanggan = await query("SELECT * FROM pelanggan");
    return Response.json({ success: true, data: pelanggan });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nama, email, password, no_hp, alamat } = await request.json();
    const { hashPassword } = await import("@/lib/auth");
    const hashedPassword = hashPassword(password);

    await query(
      "INSERT INTO pelanggan (nama, email, password, no_hp, alamat) VALUES (?, ?, ?, ?, ?)",
      [nama, email, hashedPassword, no_hp, alamat]
    );

    return Response.json({ success: true, message: "Pelanggan created successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
