import { query } from "@/lib/db";

export async function GET(request) {
  try {
    const broadcast = await query(
      "SELECT b.*, a.nama FROM broadcast b JOIN admin a ON b.id_admin = a.id_admin"
    );
    return Response.json({ success: true, data: broadcast });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id_admin, judul, isi, tanggal_kirim, tipe_penerima } = await request.json();

    await query(
      "INSERT INTO broadcast (id_admin, judul, isi, tanggal_kirim, tipe_penerima) VALUES (?, ?, ?, ?, ?)",
      [id_admin, judul, isi, tanggal_kirim, tipe_penerima || 'all']
    );

    return Response.json({ success: true, message: "Broadcast created successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
