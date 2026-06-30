import { NextResponse } from "next/server";
import { getCollection } from "../../../../lib/db";
import {
  createSessionToken,
  getSessionExpiresAt,
  hashPassword,
  hashSessionToken,
  normalizeEmail,
  SESSION_COOKIE_NAME,
} from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Semua field wajib diisi" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password minimal 8 karakter" }, { status: 400 });
    }

    const usersCol = await getCollection("users");
    const existing = await usersCol.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, error: "Email sudah terdaftar" }, { status: 409 });
    }

    const passwordHash = hashPassword(password);
    const insertResult = await usersCol.insertOne({
      name,
      email,
      password_hash: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const userId = insertResult.insertedId;
    const sessionToken = createSessionToken();
    const tokenHash = hashSessionToken(sessionToken);
    const expiresAt = getSessionExpiresAt();

    const sessionsCol = await getCollection("sessions");
    await sessionsCol.insertOne({
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      created_at: new Date(),
    });

    const response = NextResponse.json(
      { success: true, user: { id: String(userId), name, email } },
      { status: 201 }
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
    return NextResponse.json({ success: false, error: "Gagal membuat akun" }, { status: 500 });
  }
}
