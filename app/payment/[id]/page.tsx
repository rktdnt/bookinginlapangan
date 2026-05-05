"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<any | null>(null);
  const [venue, setVenue] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Pembayaran berhasil diproses.");

  // Fetch booking details
  useEffect(() => {
    (async () => {
      try {
        const bookings = await fetch(`/api/bookings`).then((r) => r.json());
        const b = bookings?.bookings?.find((x: any) => String(x.id) === bookingId);
        if (!b) {
          setError("Booking not found");
          setLoading(false);
          return;
        }
        setBooking(b);

        // Fetch venue details
        const venues = await fetch(`/api/venues`).then((r) => r.json());
        const v = venues?.find((x: any) => x.id === b.venue_id);
        if (v) setVenue(v);
      } catch (err: any) {
        setError(err.message || "Failed to load booking");
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    try {
      const formData = new FormData();
      formData.append("bookingId", bookingId);
      formData.append("paymentMethod", paymentMethod);
      if (paymentMethod === "transfer" && proofFile) {
        formData.append("proofFile", proofFile);
      }

      const res = await fetch("/api/payment/confirm", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");

      if (data.requiresAdminConfirmation) {
        setSuccessMessage("Pembayaran transfer diterima. Booking menunggu konfirmasi admin.");
      } else {
        setSuccessMessage(paymentMethod === "qris" ? "Pembayaran QRIS berhasil dan booking sudah dikonfirmasi." : "Pembayaran berhasil dan booking sudah dikonfirmasi.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err: any) {
      setError(err.message || "Payment processing failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8">
        <p className="text-center text-sm text-zinc-500">Loading...</p>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-md rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
          <div className="text-4xl font-bold text-green-600">✓</div>
          <h1 className="mt-4 text-2xl font-bold text-green-700">Pembayaran Berhasil!</h1>
          <p className="mt-2 text-sm text-green-600">{successMessage} Redirecting...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-[var(--primary)] hover:underline">← Kembali</Link>

        <h1 className="mt-6 text-3xl font-bold">Konfirmasi Pembayaran</h1>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* Booking Summary */}
          <div className="md:col-span-1">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">Ringkasan Booking</p>

              {venue && (
                <>
                  <img src={venue.image} alt="" className="mt-4 h-32 w-full rounded-xl object-cover" />
                  <p className="mt-3 font-semibold text-[var(--foreground)]">{venue.name}</p>
                  <p className="text-sm text-zinc-500">{venue.location}</p>
                </>
              )}

              {booking && (
                <>
                  <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-4 text-sm">
                    <div className="flex justify-between"><span>Nama</span><span className="font-semibold">{booking.customer_name || booking.venue_id}</span></div>
                    <div className="flex justify-between"><span>Tanggal</span><span className="font-semibold">{booking.booking_date}</span></div>
                    <div className="flex justify-between"><span>Jam</span><span className="font-semibold">{booking.booking_time}</span></div>
                    <div className="flex justify-between"><span>Status</span><span className="rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">{booking.status}</span></div>
                  </div>

                  <div className="mt-4 border-t border-[var(--border)] pt-4">
                    <div className="flex justify-between"><span className="font-semibold">Total Harga</span><span className="text-lg font-bold text-[var(--primary)]">Rp {(venue?.price || 0).toLocaleString()}</span></div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--border)] bg-white p-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)]">Metode Pembayaran</label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className={`cursor-pointer rounded-xl border p-4 transition ${paymentMethod === "qris" ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] bg-white"}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" value="qris" checked={paymentMethod === "qris"} onChange={(e) => setPaymentMethod(e.target.value)} />
                      <div>
                        <span className="block text-sm font-semibold text-[var(--foreground)]">QRIS</span>
                        <span className="text-xs text-zinc-500">Scan kode QR lalu bayar instan</span>
                      </div>
                    </div>
                  </label>
                  <label className={`cursor-pointer rounded-xl border p-4 transition ${paymentMethod === "transfer" ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] bg-white"}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" value="transfer" checked={paymentMethod === "transfer"} onChange={(e) => setPaymentMethod(e.target.value)} />
                      <div>
                        <span className="block text-sm font-semibold text-[var(--foreground)]">Transfer Bank</span>
                        <span className="text-xs text-zinc-500">Upload bukti pembayaran</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {paymentMethod === "qris" && (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--foreground)]/5 p-4">
                  <div className="grid gap-4 md:grid-cols-[160px_1fr] md:items-center">
                    <img src="/qris.svg" alt="QRIS" className="mx-auto w-40 rounded-xl bg-white p-2" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">Scan QRIS untuk bayar</p>
                      <p className="mt-1 text-xs text-zinc-600">Setelah pembayaran sukses, booking akan langsung dikonfirmasi.</p>
                      <p className="mt-2 text-xs text-zinc-500">Metode ini menggantikan kartu kredit/debit.</p>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "transfer" && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Transfer Bank</p>
                    <p className="mt-2 text-xs text-blue-700">Bank BCA: 1234567890 a.n PT BookinginLapangan</p>
                    <p className="mt-1 text-xs text-blue-600">Upload bukti transfer agar admin bisa memverifikasi pembayaran.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--foreground)]">Upload Bukti Pembayaran</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                      className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
                      required
                    />
                    {proofFile && <p className="mt-2 text-xs text-blue-700">File dipilih: {proofFile.name}</p>}
                  </div>
                </div>
              )}

              {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

              <button
                type="submit"
                disabled={processing || (paymentMethod === "transfer" && !proofFile)}
                className="w-full rounded-lg bg-[linear-gradient(135deg,var(--primary),var(--primary-700))] px-4 py-3 font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-70"
              >
                {processing ? "Memproses..." : paymentMethod === "qris" ? `Bayar QRIS Rp ${venue ? venue.price.toLocaleString() : "0"}` : `Kirim Bukti Transfer`}
              </button>

              <p className="text-center text-xs text-zinc-500">Pembayaran aman dan terenkripsi</p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
