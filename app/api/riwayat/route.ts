import { query } from "@/lib/db";

export async function GET(request) {
  try {
    const riwayat = await query(
      "SELECT r.*, o.id_pelanggan, l.nama_lapangan FROM riwayat r JOIN orders o ON r.id_order = o.id_order JOIN lapangan l ON o.id_lapangan = l.id_lapangan"
    );
    return Response.json({ success: true, data: riwayat });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id_order, status_akhir, tanggal_selesai, catatan } = await request.json();

    await query(
      "INSERT INTO riwayat (id_order, status_akhir, tanggal_selesai, catatan) VALUES (?, ?, ?, ?)",
      [id_order, status_akhir, tanggal_selesai, catatan]
    );

    return Response.json({ success: true, message: "Riwayat created successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
