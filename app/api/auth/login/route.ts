import { NextResponse } from "next/server";
import { transaction } from "../../../../lib/db";
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

    const result = await transaction(async (client: any) => {
      const [userRows] = await client.query(
        "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
        [email]
      );
      const user = (userRows as any[])[0];
      if (!user || !verifyPassword(password, user.password_hash)) {
        const error = new Error("INVALID_CREDENTIALS");
        // @ts-expect-error custom code
        error.code = "INVALID_CREDENTIALS";
        throw error;
      }

      const sessionToken = createSessionToken();
      const tokenHash = hashSessionToken(sessionToken);
      const expiresAt = getSessionExpiresAt();

      await client.query(
        "INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
        [user.id, tokenHash, expiresAt]
      );

      return { user: { id: user.id, name: user.name, email: user.email }, sessionToken, expiresAt };
    });

    const response = NextResponse.json({ success: true, user: result.user }, { status: 200 });
    response.cookies.set(SESSION_COOKIE_NAME, result.sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: result.expiresAt,
    });
    return response;
  } catch (error: any) {
    if (String(error?.message || "") === "INVALID_CREDENTIALS" || error?.code === "INVALID_CREDENTIALS") {
      return NextResponse.json({ success: false, error: "Email atau password salah" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Gagal login" }, { status: 500 });
  }
}
