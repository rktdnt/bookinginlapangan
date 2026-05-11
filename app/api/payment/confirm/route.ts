import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { query } from "../../../../lib/db";
import { SESSION_COOKIE_NAME, hashSessionToken } from "../../../../lib/auth";

async function updateBookingPayment(
  bookingId: string,
  status: "pending" | "confirmed",
  method: "qris" | "transfer",
  proofPath: string | null,
  proofName: string | null
) {
  try {
    await query(
      `UPDATE bookings SET status = ?, payment_method = ?, payment_proof_path = ?, payment_proof_name = ? WHERE id = ?`,
      [status, method, proofPath, proofName, bookingId]
    );
  } catch (error: any) {
    // Backward compatibility when migration 005 is not applied yet.
    if (error?.code === "ER_BAD_FIELD_ERROR") {
      await query(`UPDATE bookings SET status = ? WHERE id = ?`, [status, bookingId]);
      return;
    }
    throw error;
  }
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

    // Verify user owns this booking
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    let userId: number | null = null;
    if (token) {
      const tokenHash = hashSessionToken(token);
      const rows = (await query(
        `SELECT u.id FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > NOW() LIMIT 1`,
        [tokenHash]
      )) as any[];
      if (rows[0]) userId = rows[0].id;
    }

    const bookings = (await query(
      `SELECT id, user_id FROM bookings WHERE id = ? LIMIT 1`,
      [bookingId]
    )) as any[];

    const booking = bookings[0];
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    // If user is logged in, verify they own it; if not logged in, allow (guest checkout)
    if (userId && booking.user_id && booking.user_id !== userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    if (paymentMethod === "qris") {
      await updateBookingPayment(bookingId, "confirmed", "qris", null, null);

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

      await updateBookingPayment(bookingId, "pending", "transfer", relativePath, proofFile.name);

      return NextResponse.json({
        success: true,
        bookingId,
        status: "pending",
        requiresAdminConfirmation: true,
        proofPath: relativePath,
      });
    }

    // Legacy mock card flow kept for compatibility if older clients still send it.
    if (paymentMethod === "card") {
      const lastDigit = parseInt(cardNumber.slice(-1));
      if (isNaN(lastDigit) || lastDigit % 2 !== 0) {
        return NextResponse.json({ success: false, error: "Payment failed: Invalid card" }, { status: 400 });
      }

      await updateBookingPayment(bookingId, "confirmed", "qris", null, null);

      return NextResponse.json({ success: true, bookingId, status: "confirmed", requiresAdminConfirmation: false });
    }

    return NextResponse.json({ success: false, error: "Unsupported payment method" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Payment failed" }, { status: 500 });
  }
}
