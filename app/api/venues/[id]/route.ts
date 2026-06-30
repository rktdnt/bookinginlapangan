import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getCollection, toObjectId } from "../../../../lib/db";

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const dbConfigured = Boolean(process.env.MONGODB_URI || process.env.MONGODB_DATABASE);
  if (!dbConfigured) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) {
      return NextResponse.json({ success: false, error: "Invalid venue id" }, { status: 400 });
    }

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

    const col = await getCollection("venues");
    const existing = await col.findOne({ _id: oid, is_deleted: { $ne: true } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Venue not found" }, { status: 404 });
    }

    let imagePath = String(existing.image || "/images/placeholder.svg");
    if (imageFile && typeof imageFile !== "string") {
      const file = imageFile as File;
      if (!String(file.type || "").startsWith("image/")) {
        return NextResponse.json({ success: false, error: "File must be an image" }, { status: 400 });
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const extension = path.extname(file.name || "").toLowerCase() || ".jpg";
      const safeExtension = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(extension) ? extension : ".jpg";
      const fileName = `${id}-${Date.now()}${safeExtension}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "venues");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      imagePath = `/uploads/venues/${fileName}`;
    }

    let facilities: string[] = [];
    try {
      if (facilitiesRaw.startsWith("[")) {
        facilities = JSON.parse(facilitiesRaw);
      } else if (facilitiesRaw.length) {
        facilities = facilitiesRaw.split(",").map((s) => s.trim()).filter(Boolean);
      }
    } catch {}

    await col.updateOne(
      { _id: oid },
      { $set: { name, image: imagePath, price, location, description, facilities, size, surface_type, hours, updated_at: new Date() } }
    );

    return NextResponse.json({
      success: true,
      venue: { id, name, image: imagePath, price, location, description, facilities, size, surface_type, hours },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to update venue" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const dbConfigured = Boolean(process.env.MONGODB_URI || process.env.MONGODB_DATABASE);
  if (!dbConfigured) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) {
      return NextResponse.json({ success: false, error: "Invalid venue id" }, { status: 400 });
    }
    const col = await getCollection("venues");
    await col.updateOne({ _id: oid }, { $set: { is_deleted: true, updated_at: new Date() } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to delete venue" }, { status: 500 });
  }
}