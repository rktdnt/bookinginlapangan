import { NextResponse } from "next/server";
import { transaction } from "../../../../lib/db";
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

    const result = await transaction(async (client: any) => {
      const [existing] = await client.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
      if ((existing as any[]).length > 0) {
        const error = new Error("EMAIL_EXISTS");
        // @ts-expect-error custom code
        error.code = "EMAIL_EXISTS";
        throw error;
      }

      const passwordHash = hashPassword(password);
      const [insertResult] = await client.query(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, passwordHash]
      );
      const userId = (insertResult as any).insertId;
      const [userRows] = await client.query("SELECT id, name, email FROM users WHERE id = ? LIMIT 1", [userId]);
      const user = (userRows as any[])[0];
      const sessionToken = createSessionToken();
      const tokenHash = hashSessionToken(sessionToken);
      const expiresAt = getSessionExpiresAt();

      await client.query(
        "INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
        [user.id, tokenHash, expiresAt]
      );

      return { user, sessionToken, expiresAt };
    });

    const response = NextResponse.json({ success: true, user: result.user }, { status: 201 });
    response.cookies.set(SESSION_COOKIE_NAME, result.sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: result.expiresAt,
    });
    return response;
  } catch (error: any) {
    if (String(error?.message || "") === "EMAIL_EXISTS" || error?.code === "EMAIL_EXISTS") {
      return NextResponse.json({ success: false, error: "Email sudah terdaftar" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Gagal membuat akun" }, { status: 500 });
  }
}
