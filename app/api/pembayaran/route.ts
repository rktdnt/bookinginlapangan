import { query } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const pembayaran = await query(
      "SELECT p.*, o.id_pelanggan, o.total_harga FROM pembayaran p JOIN orders o ON p.id_order = o.id_order"
    );
    return Response.json({ success: true, data: pembayaran });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id_order, metode_pembayaran, tanggal_bayar, jumlah_bayar, bukti_pembayaran } = await request.json();

    await query(
      "INSERT INTO pembayaran (id_order, metode_pembayaran, tanggal_bayar, status_pembayaran, jumlah_bayar, bukti_pembayaran) VALUES (?, ?, ?, 'pending', ?, ?)",
      [id_order, metode_pembayaran, tanggal_bayar, jumlah_bayar, bukti_pembayaran]
    );

    return Response.json({ success: true, message: "Pembayaran created successfully" });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
