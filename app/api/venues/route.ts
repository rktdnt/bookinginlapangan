import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getCollection, toObjectId, normalizeDoc, normalizeDocs } from "../../../lib/db";

export const runtime = "nodejs";

const sample = [
  { id: "1", name: "Lapangan A", image: "/images/field1.svg", price: 150000, location: "Jakarta Utara", description: "Lapangan sintetis ukuran standar.", facilities: ["Pencahayaan", "Kamar Mandi"], details: { size: "40x20", type: "Sintetis" } },
  { id: "2", name: "Lapangan B", image: "/images/field2.svg", price: 120000, location: "Jakarta Selatan", description: "Lapangan futsal nyaman dengan tribun.", facilities: ["Tribun", "Parkir"], details: { size: "30x15", type: "Sintetis" } },
  { id: "3", name: "Lapangan C", image: "/images/field3.svg", price: 100000, location: "Depok", description: "Lapangan rumput alami.", facilities: ["Rumput Alami", "Ruang Ganti"], details: { size: "45x25", type: "Alami" } },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const dbConfigured = Boolean(
    process.env.MONGODB_URI || process.env.MONGODB_DATABASE
  );
  if (!dbConfigured) {
    if (id) {
      const found = sample.find((s) => s.id === id);
      return NextResponse.json(found || null);
    }
    return NextResponse.json(sample);
  }

  try {
    const col = await getCollection("venues");

    if (id) {
      const oid = toObjectId(id);
      // Try ObjectId lookup first, then string id fallback
      const doc = oid
        ? await col.findOne({ _id: oid, is_deleted: { $ne: true } })
        : await col.findOne({ id, is_deleted: { $ne: true } });

      if (!doc) return NextResponse.json(null);

      const r = normalizeDoc(doc);
      if (r) {
        if (!Array.isArray(r.facilities)) r.facilities = [];
        if (!r.details || typeof r.details !== "object") r.details = {};
      }
      return NextResponse.json(r);
    }

    const docs = await col
      .find({ is_deleted: { $ne: true } })
      .sort({ name: 1 })
      .limit(200)
      .toArray();

    const parsed = normalizeDocs(docs).map((r) => {
      if (!Array.isArray(r!.facilities)) r!.facilities = [];
      if (!r!.details || typeof r!.details !== "object") r!.details = {};
      return r;
    });
    return NextResponse.json(parsed);
  } catch {
    // Graceful fallback if DB is not ready
    if (id) {
      const found = sample.find((s) => s.id === id);
      return NextResponse.json(found || null);
    }
    return NextResponse.json(sample);
  }
}

export async function POST(request: Request) {
  const dbConfigured = Boolean(
    process.env.MONGODB_URI || process.env.MONGODB_DATABASE
  );
  if (!dbConfigured) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const price = Number(formData.get("price") || 0);
    const location = String(formData.get("location") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const facilitiesRaw = String(formData.get("facilities") || "").trim();
    const detailsRaw = String(formData.get("details") || "").trim();
    const size = String(formData.get("size") || "").trim();
    const surface_type = String(formData.get("surface_type") || "").trim();
    const hours = String(formData.get("hours") || "").trim();
    const imageFile = formData.get("image");

    if (!name || !price || !location || !description) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    let imagePath = "/images/placeholder.svg";
    if (imageFile && typeof imageFile !== "string") {
      if (!String((imageFile as File).type || "").startsWith("image/")) {
        return NextResponse.json({ success: false, error: "File must be an image" }, { status: 400 });
      }
      const file = imageFile as File;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const extension = path.extname(file.name || "").toLowerCase() || ".jpg";
      const safeExtension = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(extension) ? extension : ".jpg";
      const fileName = `${crypto.randomUUID()}${safeExtension}`;
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

    let details: Record<string, any> = {};
    try {
      details = detailsRaw ? JSON.parse(detailsRaw) : {};
    } catch {
      details = { note: detailsRaw };
    }

    const col = await getCollection("venues");
    const result = await col.insertOne({
      name,
      image: imagePath,
      price,
      location,
      description,
      facilities,
      size,
      surface_type,
      hours,
      details,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const id = String(result.insertedId);
    return NextResponse.json(
      { success: true, venue: { id, name, image: imagePath, price, location, description, facilities, size, surface_type, hours } },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to create venue" }, { status: 500 });
  }
}
