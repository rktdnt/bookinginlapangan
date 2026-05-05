import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "../../../../../lib/db";
import { SESSION_COOKIE_NAME, hashSessionToken } from "../../../../../lib/auth";

async function getAdminUser() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const rows = (await query(
    `SELECT u.id, u.name, u.email
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  )) as any[];

  const user = rows[0];
  const isAdmin = (process.env.ADMIN_EMAIL && user?.email === process.env.ADMIN_EMAIL) || user?.id === 1;
  return user && isAdmin ? user : null;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const action = String(body.action || "").trim().toLowerCase();

    if (!id || !action) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const bookings = (await query(
      `SELECT id, status FROM bookings WHERE id = ? LIMIT 1`,
      [id]
    )) as any[];

    const booking = bookings[0];
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    if (action === "confirm") {
      if (booking.status === "confirmed") {
        return NextResponse.json({ success: true, bookingId: id, status: "confirmed" });
      }

      await query(`UPDATE bookings SET status = ? WHERE id = ?`, ["confirmed", id]);
      return NextResponse.json({ success: true, bookingId: id, status: "confirmed" });
    }

    if (action === "cancel") {
      await query(`UPDATE bookings SET status = ? WHERE id = ?`, ["cancelled", id]);
      return NextResponse.json({ success: true, bookingId: id, status: "cancelled" });
    }

    return NextResponse.json({ success: false, error: "Unsupported action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to update booking" }, { status: 500 });
  }
}