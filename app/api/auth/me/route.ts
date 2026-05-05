import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "../../../../lib/db";
import { SESSION_COOKIE_NAME, hashSessionToken } from "../../../../lib/auth";

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const tokenHash = hashSessionToken(token);
  const rows = await query(
    `SELECT u.id, u.name, u.email
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  ) as any[];

  if (!rows[0]) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = rows[0];
  const isAdmin = (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL) || user.id === 1;
  return NextResponse.json({ authenticated: true, user: { ...user, isAdmin } });
}
