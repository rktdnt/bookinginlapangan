import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "../../../lib/db";
import { hashSessionToken, SESSION_COOKIE_NAME } from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch (parseErr: any) {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }
    const venueId = String(body.venueId || "").trim();
    const name = String(body.name || "").trim();
    const date = String(body.date || "").trim();
    const time = String(body.time || "").trim();

    if (!venueId || !name || !date || !time) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    // If user is authenticated, attach user_id to booking when possible
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    let userId: number | null = null;
    if (token) {
      const tokenHash = hashSessionToken(token);
      const rows = (await query(
        `SELECT u.id FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > NOW() LIMIT 1`,
        [tokenHash]
      )) as any[];
      if (rows[0]) userId = rows[0].id;
    }

    const result = await query(
      userId
        ? "INSERT INTO bookings (venue_id, user_id, customer_name, booking_date, booking_time, status) VALUES (?, ?, ?, ?, ?, ?)"
        : "INSERT INTO bookings (venue_id, customer_name, booking_date, booking_time, status) VALUES (?, ?, ?, ?, ?)",
      userId
        ? [venueId, userId, name, date, time, "pending"]
        : [venueId, name, date, time, "pending"]
    ) as any;

    const booking = {
      id: String(result.insertId || Date.now()),
      venueId,
      name,
      date,
      time,
      status: "pending",
    };

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to create booking" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    const tokenHash = hashSessionToken(token);
    const rows = (await query(
      `SELECT u.id FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > NOW() LIMIT 1`,
      [tokenHash]
    )) as any[];
    if (!rows[0]) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    const userId = rows[0].id;

    const bookings = (await query(
      `SELECT b.id, b.venue_id, v.name as venue_name, v.image as venue_image, b.booking_date, b.booking_time, b.status
       FROM bookings b
       LEFT JOIN venues v ON v.id = b.venue_id
       WHERE b.user_id = ? ORDER BY b.created_at DESC LIMIT 50`,
      [userId]
    )) as any[];

    return NextResponse.json({ success: true, bookings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to fetch bookings" }, { status: 500 });
  }
}
