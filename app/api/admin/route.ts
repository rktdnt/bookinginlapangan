import { query } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const admin = await query("SELECT * FROM admin");
    return Response.json({ success: true, data: admin });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nama, email, password, no_hp } = await request.json();

    // Hash password
    const { hashPassword } = await import("@/lib/auth");
    const hashedPassword = hashPassword(password);

    await query(
      "INSERT INTO admin (nama, email, password, no_hp) VALUES (?, ?, ?, ?)",
      [nama, email, hashedPassword, no_hp]
    );

    return Response.json({ success: true, message: "Admin created successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
