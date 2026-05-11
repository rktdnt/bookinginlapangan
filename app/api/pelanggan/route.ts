import { query } from "@/lib/db";

export async function GET(request) {
  try {
    const pelanggan = await query("SELECT * FROM pelanggan");
    return Response.json({ success: true, data: pelanggan });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { nama, email, password, no_hp, alamat } = await request.json();
    const { hashPassword } = await import("@/lib/auth");
    const hashedPassword = hashPassword(password);

    await query(
      "INSERT INTO pelanggan (nama, email, password, no_hp, alamat) VALUES (?, ?, ?, ?, ?)",
      [nama, email, hashedPassword, no_hp, alamat]
    );

    return Response.json({ success: true, message: "Pelanggan created successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
