import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Here we'd validate and persist the booking. For the prototype we just echo back.
    const booking = {
      id: String(Date.now()),
      venueId: body.venueId,
      name: body.name,
      date: body.date,
      time: body.time,
      status: "confirmed",
    };
    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
