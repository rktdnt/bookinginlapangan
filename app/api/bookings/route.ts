import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCollection, toObjectId, normalizeDocs } from "../../../lib/db";
import { hashSessionToken, SESSION_COOKIE_NAME } from "../../../lib/auth";

async function getSessionUser() {
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
  return usersCol.findOne({ _id: session.user_id });
}

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const venueId = String(body.venueId || "").trim();
    const name = String(body.name || "").trim();
    const date = String(body.date || "").trim();
    const time = String(body.time || "").trim();

    if (!venueId || !name || !date || !time) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const user = await getSessionUser();
    const bookingsCol = await getCollection("bookings");

    const doc: any = {
      venue_id: venueId,
      customer_name: name,
      booking_date: date,
      booking_time: time,
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    };
    if (user) {
      doc.user_id = user._id;
    }

    const result = await bookingsCol.insertOne(doc);
    const bookingId = String(result.insertedId);

    return NextResponse.json(
      { success: true, booking: { id: bookingId, venueId, name, date, time, status: "pending" } },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to create booking" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const bookingsCol = await getCollection("bookings");
    const venuesCol = await getCollection("venues");

    const rawBookings = await bookingsCol
      .find({ user_id: user._id })
      .sort({ created_at: -1 })
      .limit(50)
      .toArray();

    // Enrich with venue data
    const bookings = await Promise.all(
      rawBookings.map(async (b) => {
        const venueOid = toObjectId(b.venue_id);
        const venue = venueOid ? await venuesCol.findOne({ _id: venueOid }) : null;
        return {
          id: String(b._id),
          venue_id: b.venue_id,
          venue_name: venue?.name || null,
          venue_image: venue?.image || null,
          booking_date: b.booking_date,
          booking_time: b.booking_time,
          status: b.status,
        };
      })
    );

    return NextResponse.json({ success: true, bookings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to fetch bookings" }, { status: 500 });
  }
}
