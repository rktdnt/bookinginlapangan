import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  const envPresent = Boolean(
    process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_DATABASE || process.env.MYSQL_HOST
  );

  try {
    const rows = await query("SELECT 1 as ok LIMIT 1");
    return NextResponse.json({ envPresent, canConnect: true, result: rows });
  } catch (err: any) {
    return NextResponse.json({ envPresent, canConnect: false, error: err?.message || String(err) }, { status: 200 });
  }
}
