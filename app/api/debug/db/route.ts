import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  const dbConfigured = Boolean(process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_DATABASE);
  if (!dbConfigured) {
    return NextResponse.json({ dbConfigured: false, canConnect: false, message: "DB env not set" });
  }

  try {
    const rows = await query("SELECT 1 as ok LIMIT 1");
    return NextResponse.json({ dbConfigured: true, canConnect: true, result: rows });
  } catch (err: any) {
    return NextResponse.json({ dbConfigured: true, canConnect: false, error: err?.message || String(err) }, { status: 200 });
  }
}
