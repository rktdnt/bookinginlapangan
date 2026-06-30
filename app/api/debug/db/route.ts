import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  const envPresent = Boolean(
    process.env.MONGODB_URI || process.env.MONGODB_DATABASE
  );

  try {
    const db = await getDb();
    // Ping the deployment to confirm connection
    await db.command({ ping: 1 });
    return NextResponse.json({ envPresent, canConnect: true, driver: "mongodb" });
  } catch (err: any) {
    return NextResponse.json(
      { envPresent, canConnect: false, driver: "mongodb", error: err?.message || String(err) },
      { status: 200 }
    );
  }
}
