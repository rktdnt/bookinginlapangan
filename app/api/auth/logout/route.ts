import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCollection } from "../../../../lib/db";
import { SESSION_COOKIE_NAME, hashSessionToken } from "../../../../lib/auth";

export async function POST(request: Request) {
  const cookieJar = await cookies();
  const token = cookieJar.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const tokenHash = hashSessionToken(token);
    try {
      const sessionsCol = await getCollection("sessions");
      await sessionsCol.deleteOne({ token_hash: tokenHash });
    } catch {
      // Ignore DB errors on logout; still clear cookie.
    }
  }

  const response = NextResponse.redirect(new URL("/", request.url), { status: 303 });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  return response;
}
