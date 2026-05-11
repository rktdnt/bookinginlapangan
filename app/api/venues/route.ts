import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { query } from "../../../lib/db";

export const runtime = "nodejs";

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

export async function POST(request: Request) {
  const dbConfigured = Boolean(process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_DATABASE);
  if (!dbConfigured) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const price = Number(formData.get("price") || 0);
    const location = String(formData.get("location") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const imageFile = formData.get("image");

    if (!name || !price || !location || !description) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    let imagePath = "/images/placeholder.svg";
    if (imageFile && typeof imageFile !== "string") {
      if (!String(imageFile.type || "").startsWith("image/")) {
        return NextResponse.json({ success: false, error: "File must be an image" }, { status: 400 });
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const extension = path.extname(imageFile.name || "").toLowerCase() || ".jpg";
      const safeExtension = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(extension) ? extension : ".jpg";
      const fileName = `${crypto.randomUUID()}${safeExtension}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "venues");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      imagePath = `/uploads/venues/${fileName}`;
    }

    const id = crypto.randomUUID();
    await query(
      "INSERT INTO venues (id, name, image, price, location, description) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, imagePath, price, location, description]
    );

    return NextResponse.json({
      success: true,
      venue: { id, name, image: imagePath, price, location, description },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to create venue" }, { status: 500 });
  }
}
