import { NextResponse } from "next/server";
import { getCollection } from "../../../../lib/db";
import {
  createSessionToken,
  getSessionExpiresAt,
  hashSessionToken,
  normalizeEmail,
  SESSION_COOKIE_NAME,
  verifyPassword,
} from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const usersCol = await getCollection("users");
    const user = await usersCol.findOne({ email });

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ success: false, error: "Email atau password salah" }, { status: 401 });
    }

    const sessionToken = createSessionToken();
    const tokenHash = hashSessionToken(sessionToken);
    const expiresAt = getSessionExpiresAt();

    const sessionsCol = await getCollection("sessions");
    await sessionsCol.insertOne({
      user_id: user._id,
      token_hash: tokenHash,
      expires_at: expiresAt,
      created_at: new Date(),
    });

    const response = NextResponse.json(
      { success: true, user: { id: String(user._id), name: user.name, email: user.email } },
      { status: 200 }
    );
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: expiresAt,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Gagal login" }, { status: 500 });
  }
}
