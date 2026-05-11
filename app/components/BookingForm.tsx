"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingForm({ venueId, pricePerHour = 150000 }: { venueId: string; pricePerHour?: number }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate duration in hours from start and end time
  const calculateDuration = () => {
    if (!timeStart || !timeEnd) return 0;
    const [startHour, startMin] = timeStart.split(":").map(Number);
    const [endHour, endMin] = timeEnd.split(":").map(Number);
    
    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;
    
    if (endTotalMin <= startTotalMin) return 0;
    return (endTotalMin - startTotalMin) / 60;
  };

  const duration = calculateDuration();
  const totalPrice = duration * pricePerHour;

  // When start time changes, update end time minutes to match
  const handleStartTimeChange = (newStartTime: string) => {
    setTimeStart(newStartTime);
    if (timeEnd) {
      const startMinutes = newStartTime.split(":")[1];
      const endHour = timeEnd.split(":")[0];
      setTimeEnd(`${endHour}:${startMinutes}`);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (duration <= 0) {
      setError("Jam akhir harus lebih besar dari jam mulai");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId, name, date, time: timeStart }),
      });
      if (!res.ok) throw new Error("Gagal membuat booking");
      const data = await res.json();
      router.push(`/payment/${data.booking.id}`);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Nama Input */}
      <div>
        <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
          Nama Pemesan
        </label>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama lengkap"
          className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
        />
      </div>

      {/* Date & Time */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
            Tanggal
          </label>
          <input
            required
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
              Jam Mulai
            </label>
            <input
              required
              type="time"
              value={timeStart}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
              Jam Akhir
            </label>
            <input
              required
              type="time"
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
        </div>
      </div>

      {/* Duration Display */}
      {duration > 0 && (
        <div className="text-xs text-zinc-600">
          Durasi: <span className="font-semibold">{duration.toFixed(1)} jam</span>
        </div>
      )}

      {/* Price Summary */}
      <div className="rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--primary)]/10 border border-[var(--accent)]/30 p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">Total Harga</p>
            <p className="mt-1 text-2xl font-black text-[var(--primary)]">Rp {totalPrice.toLocaleString()}</p>
          </div>
          <p className="text-xs text-zinc-600">{duration.toFixed(1)} jam × Rp {pricePerHour.toLocaleString()}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="reset"
          onClick={() => {
            setName("");
            setDate("");
            setTimeStart("");
            setTimeEnd("");
            setError(null);
          }}
          className="flex-1 rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-zinc-50 active:scale-95"
        >
          Reset
        </button>
        <button
          disabled={loading || duration <= 0}
          type="submit"
          className="flex-1 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-700)] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Memproses..." : "Lanjut ke Pembayaran"}
        </button>
      </div>
    </form>
  );
}
