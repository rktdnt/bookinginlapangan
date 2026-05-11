import { query } from "@/lib/db";

export async function GET(request) {
  try {
    const lapangan = await query("SELECT * FROM lapangan");
    return Response.json({ success: true, data: lapangan });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id_mitra, nama_lapangan, jenis_olahraga, lokasi, harga, status_ketersediaan, deskripsi, foto } = await request.json();

    await query(
      "INSERT INTO lapangan (id_mitra, nama_lapangan, jenis_olahraga, lokasi, harga, status_ketersediaan, deskripsi, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id_mitra, nama_lapangan, jenis_olahraga, lokasi, harga, status_ketersediaan || 'available', deskripsi, foto]
    );

    return Response.json({ success: true, message: "Lapangan created successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
