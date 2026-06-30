import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCollection } from "../../../../lib/db";
import { SESSION_COOKIE_NAME, hashSessionToken } from "../../../../lib/auth";

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const tokenHash = hashSessionToken(token);
  const sessionsCol = await getCollection("sessions");

  const session = await sessionsCol.findOne({
    token_hash: tokenHash,
    expires_at: { $gt: new Date() },
  });

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const usersCol = await getCollection("users");
  const user = await usersCol.findOne({ _id: session.user_id });

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const isAdmin =
    (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL) ||
    false;

  return NextResponse.json({
    authenticated: true,
    user: { id: String(user._id), name: user.name, email: user.email, isAdmin },
  });
}
