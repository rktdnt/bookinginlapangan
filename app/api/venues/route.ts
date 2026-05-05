import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

const sample = [
  { id: "1", name: "Lapangan A", image: "/images/field1.svg", price: 150000, location: "Jakarta Utara", description: "Lapangan sintetis ukuran standar." },
  { id: "2", name: "Lapangan B", image: "/images/field2.svg", price: 120000, location: "Jakarta Selatan", description: "Lapangan futsal nyaman dengan tribun." },
  { id: "3", name: "Lapangan C", image: "/images/field3.svg", price: 100000, location: "Depok", description: "Lapangan rumput alami." },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const dbConfigured = Boolean(process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_DATABASE);
  if (!dbConfigured) {
    if (id) {
      const found = sample.find((s) => s.id === id);
      return NextResponse.json(found || null);
    }
    return NextResponse.json(sample);
  }

  try {
    if (id) {
      const rows = await query(
        "SELECT id, name, image, price, location, description FROM venues WHERE id = ? LIMIT 1",
        [id]
      );
      return NextResponse.json((rows as any[])[0] || null);
    }

    const rows = await query(
      "SELECT id, name, image, price, location, description FROM venues ORDER BY name ASC LIMIT 200"
    );
    return NextResponse.json(rows);
  } catch {
    // Graceful fallback if DB is not ready.
    if (id) {
      const found = sample.find((s) => s.id === id);
      return NextResponse.json(found || null);
    }
    return NextResponse.json(sample);
  }
}
