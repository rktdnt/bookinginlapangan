import { query } from "@/lib/db";

export async function GET(request) {
  try {
    const cs = await query(
      "SELECT cs.*, p.nama as nama_pelanggan, m.nama_mitra FROM customer_service cs LEFT JOIN pelanggan p ON cs.id_pelanggan = p.id_pelanggan LEFT JOIN mitra m ON cs.id_mitra = m.id_mitra"
    );
    return Response.json({ success: true, data: cs });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id_pelanggan, id_mitra, pesan, tanggal } = await request.json();

    await query(
      "INSERT INTO customer_service (id_pelanggan, id_mitra, pesan, tanggal, status_keluhan) VALUES (?, ?, ?, ?, 'open')",
      [id_pelanggan || null, id_mitra || null, pesan, tanggal]
    );

    return Response.json({ success: true, message: "Customer service created successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
