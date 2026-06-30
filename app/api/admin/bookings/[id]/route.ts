import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCollection, toObjectId } from "../../../../lib/db";
import { SESSION_COOKIE_NAME, hashSessionToken } from "../../../../lib/auth";

async function getAdminUser() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const tokenHash = hashSessionToken(token);
  const sessionsCol = await getCollection("sessions");
  const session = await sessionsCol.findOne({
    token_hash: tokenHash,
    expires_at: { $gt: new Date() },
  });
  if (!session) return null;
  const usersCol = await getCollection("users");
  const user = await usersCol.findOne({ _id: session.user_id });
  const isAdmin =
    (process.env.ADMIN_EMAIL && user?.email === process.env.ADMIN_EMAIL) || false;
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

    const oid = toObjectId(id);
    if (!oid) {
      return NextResponse.json({ success: false, error: "Invalid booking id" }, { status: 400 });
    }

    const bookingsCol = await getCollection("bookings");
    const booking = await bookingsCol.findOne({ _id: oid });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    if (action === "confirm") {
      if (booking.status === "confirmed") {
        return NextResponse.json({ success: true, bookingId: id, status: "confirmed" });
      }
      await bookingsCol.updateOne({ _id: oid }, { $set: { status: "confirmed", updated_at: new Date() } });
      return NextResponse.json({ success: true, bookingId: id, status: "confirmed" });
    }

    if (action === "cancel") {
      await bookingsCol.updateOne({ _id: oid }, { $set: { status: "cancelled", updated_at: new Date() } });
      return NextResponse.json({ success: true, bookingId: id, status: "cancelled" });
    }

    return NextResponse.json({ success: false, error: "Unsupported action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to update booking" }, { status: 500 });
  }
}