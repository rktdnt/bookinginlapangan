import { query } from "@/lib/db";

export async function GET(request) {
  try {
    const orders = await query(
      "SELECT o.*, l.nama_lapangan, p.nama FROM orders o JOIN lapangan l ON o.id_lapangan = l.id_lapangan JOIN pelanggan p ON o.id_pelanggan = p.id_pelanggan"
    );
    return Response.json({ success: true, data: orders });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id_pelanggan, id_lapangan, tanggal_pesan, jadwal_main, durasi, total_harga } = await request.json();

    const result = await query(
      "INSERT INTO orders (id_pelanggan, id_lapangan, tanggal_pesan, jadwal_main, durasi, total_harga, status_order) VALUES (?, ?, ?, ?, ?, ?, 'pending')",
      [id_pelanggan, id_lapangan, tanggal_pesan, jadwal_main, durasi, total_harga]
    );

    return Response.json({ success: true, message: "Order created successfully", id: result.insertId });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
