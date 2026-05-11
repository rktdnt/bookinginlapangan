import { query } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, userType } = await request.json();

    let user = null;
    let table = '';

    if (userType === 'admin') {
      table = 'admin';
      const result = await query("SELECT * FROM admin WHERE email = ?", [email]);
      user = result.length > 0 ? result[0] : null;
    } else if (userType === 'mitra') {
      table = 'mitra';
      const result = await query("SELECT * FROM mitra WHERE email = ?", [email]);
      user = result.length > 0 ? result[0] : null;
    } else if (userType === 'pelanggan') {
      table = 'pelanggan';
      const result = await query("SELECT * FROM pelanggan WHERE email = ?", [email]);
      user = result.length > 0 ? result[0] : null;
    }

    if (!user) {
      return Response.json({ success: false, error: 'User not found' }, { status: 401 });
    }

    if (!verifyPassword(password, user.password)) {
      return Response.json({ success: false, error: 'Invalid password' }, { status: 401 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return Response.json({
      success: true,
      user: userWithoutPassword,
      userType: userType,
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
