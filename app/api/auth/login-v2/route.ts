import { getCollection } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, userType } = await request.json();

    let user: any = null;

    if (userType === "admin") {
      const col = await getCollection("admin");
      user = await col.findOne({ email });
    } else if (userType === "mitra") {
      const col = await getCollection("mitra");
      user = await col.findOne({ email });
    } else if (userType === "pelanggan") {
      const col = await getCollection("pelanggan");
      user = await col.findOne({ email });
    }

    if (!user) {
      return Response.json({ success: false, error: "User not found" }, { status: 401 });
    }

    if (!verifyPassword(password, user.password)) {
      return Response.json({ success: false, error: "Invalid password" }, { status: 401 });
    }

    // Build response without password, convert _id to id string
    const { password: _, _id, ...rest } = user;
    const userResponse = { id: String(_id), ...rest };

    return Response.json({
      success: true,
      user: userResponse,
      userType,
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
