import { query } from "@/lib/db";

export async function GET(request) {
  try {
    const mitra = await query("SELECT * FROM mitra");
    return Response.json({ success: true, data: mitra });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { nama_mitra, alamat, no_hp, email, password } = await request.json();
    const { hashPassword } = await import("@/lib/auth");
    const hashedPassword = hashPassword(password);

    await query(
      "INSERT INTO mitra (nama_mitra, alamat, no_hp, email, password) VALUES (?, ?, ?, ?, ?)",
      [nama_mitra, alamat, no_hp, email, hashedPassword]
    );

    return Response.json({ success: true, message: "Mitra created successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
