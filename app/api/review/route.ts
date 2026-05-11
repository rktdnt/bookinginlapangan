import { query } from "@/lib/db";

export async function GET(request) {
  try {
    const review = await query(
      "SELECT r.*, p.nama as nama_pelanggan, m.nama_mitra FROM review r JOIN pelanggan p ON r.id_pelanggan = p.id_pelanggan JOIN mitra m ON r.id_mitra = m.id_mitra"
    );
    return Response.json({ success: true, data: review });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id_pelanggan, id_mitra, rating, komentar, tanggal_review } = await request.json();

    await query(
      "INSERT INTO review (id_pelanggan, id_mitra, rating, komentar, tanggal_review) VALUES (?, ?, ?, ?, ?)",
      [id_pelanggan, id_mitra, rating, komentar, tanggal_review]
    );

    return Response.json({ success: true, message: "Review created successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
