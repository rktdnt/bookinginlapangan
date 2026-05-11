import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { query } from "../../../../lib/db";

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const dbConfigured = Boolean(process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_DATABASE);
  if (!dbConfigured) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    const { id } = await params;
    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const price = Number(formData.get("price") || 0);
    const location = String(formData.get("location") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const facilitiesRaw = String(formData.get("facilities") || "").trim();
    const size = String(formData.get("size") || "").trim();
    const surface_type = String(formData.get("surface_type") || "").trim();
    const hours = String(formData.get("hours") || "").trim();
    const imageFile = formData.get("image");

    if (!name || !price || !location || !description) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const existingRows = (await query(
      "SELECT image FROM venues WHERE id = ? LIMIT 1",
      [id]
    )) as any[];

    if (!existingRows[0]) {
      return NextResponse.json({ success: false, error: "Venue not found" }, { status: 404 });
    }

    let imagePath = String(existingRows[0].image || "/images/placeholder.svg");
    if (imageFile && typeof imageFile !== "string") {
      if (!String(imageFile.type || "").startsWith("image/")) {
        return NextResponse.json({ success: false, error: "File must be an image" }, { status: 400 });
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const extension = path.extname(imageFile.name || "").toLowerCase() || ".jpg";
      const safeExtension = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(extension) ? extension : ".jpg";
      const fileName = `${id}-${Date.now()}${safeExtension}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "venues");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      imagePath = `/uploads/venues/${fileName}`;
    }

    // parse facilities and details
    let facilitiesJson = JSON.stringify([]);
    try {
      if (facilitiesRaw.startsWith("[")) {
        facilitiesJson = JSON.stringify(JSON.parse(facilitiesRaw));
      } else if (facilitiesRaw.length) {
        facilitiesJson = JSON.stringify(facilitiesRaw.split(',').map((s) => s.trim()).filter(Boolean));
      }
    } catch {}

    await query(
      "UPDATE venues SET name = ?, image = ?, price = ?, location = ?, description = ?, facilities = ?, size = ?, surface_type = ?, hours = ? WHERE id = ?",
      [name, imagePath, price, location, description, facilitiesJson, size, surface_type, hours, id]
    );

    return NextResponse.json({
      success: true,
      venue: { id, name, image: imagePath, price, location, description, facilities: JSON.parse(facilitiesJson), size, surface_type, hours },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to update venue" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const dbConfigured = Boolean(process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_DATABASE);
  if (!dbConfigured) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    const { id } = await params;
    await query("DELETE FROM venues WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to delete venue" }, { status: 500 });
  }
}