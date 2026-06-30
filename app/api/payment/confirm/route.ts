import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getCollection, toObjectId } from "../../../../lib/db";
import { SESSION_COOKIE_NAME, hashSessionToken } from "../../../../lib/auth";

async function getSessionUserId(): Promise<any | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const tokenHash = hashSessionToken(token);
  const sessionsCol = await getCollection("sessions");
  const session = await sessionsCol.findOne({
    token_hash: tokenHash,
    expires_at: { $gt: new Date() },
  });
  return session ? session.user_id : null;
}

async function updateBookingPayment(
  oid: any,
  status: "pending" | "confirmed",
  method: "qris" | "transfer",
  proofPath: string | null,
  proofName: string | null
) {
  const bookingsCol = await getCollection("bookings");
  await bookingsCol.updateOne(
    { _id: oid },
    {
      $set: {
        status,
        payment_method: method,
        payment_proof_path: proofPath,
        payment_proof_name: proofName,
        updated_at: new Date(),
      },
    }
  );
}

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const values: Record<string, string | File> = {};
    for (const [key, value] of formData.entries()) {
      values[key] = value;
    }
    return values;
  }
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  try {
    const body = await readPayload(request);
    const bookingId = String(body.bookingId || "").trim();
    const paymentMethod = String(body.paymentMethod || "").trim();
    const cardNumber = String(body.cardNumber || "").trim();
    const proofFile = body.proofFile instanceof File ? body.proofFile : null;

    if (!bookingId || !paymentMethod) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const userId = await getSessionUserId();
    const oid = toObjectId(bookingId);
    if (!oid) {
      return NextResponse.json({ success: false, error: "Invalid booking id" }, { status: 400 });
    }

    const bookingsCol = await getCollection("bookings");
    const booking = await bookingsCol.findOne({ _id: oid });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    // If user is logged in, verify they own it; if not logged in, allow (guest checkout)
    if (userId && booking.user_id && String(booking.user_id) !== String(userId)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    if (paymentMethod === "qris") {
      await updateBookingPayment(oid, "confirmed", "qris", null, null);
      return NextResponse.json({ success: true, bookingId, status: "confirmed", requiresAdminConfirmation: false });
    }

    if (paymentMethod === "transfer") {
      if (!proofFile) {
        return NextResponse.json({ success: false, error: "Bukti pembayaran transfer wajib diupload" }, { status: 400 });
      }
      const arrayBuffer = await proofFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const extension = path.extname(proofFile.name || "").toLowerCase() || ".png";
      const safeExtension = [".png", ".jpg", ".jpeg", ".webp"].includes(extension) ? extension : ".png";
      const fileName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${safeExtension}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "payment-proofs");
      const relativePath = `/uploads/payment-proofs/${fileName}`;
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      await updateBookingPayment(oid, "pending", "transfer", relativePath, proofFile.name);
      return NextResponse.json({
        success: true,
        bookingId,
        status: "pending",
        requiresAdminConfirmation: true,
        proofPath: relativePath,
      });
    }

    if (paymentMethod === "card") {
      const lastDigit = parseInt(cardNumber.slice(-1));
      if (isNaN(lastDigit) || lastDigit % 2 !== 0) {
        return NextResponse.json({ success: false, error: "Payment failed: Invalid card" }, { status: 400 });
      }
      await updateBookingPayment(oid, "confirmed", "qris", null, null);
      return NextResponse.json({ success: true, bookingId, status: "confirmed", requiresAdminConfirmation: false });
    }

    return NextResponse.json({ success: false, error: "Unsupported payment method" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Payment failed" }, { status: 500 });
  }
}
