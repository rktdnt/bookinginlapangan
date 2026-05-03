"use client";

import React, { useState } from "react";

export default function BookingForm({ venueId, onSuccess }: { venueId: string; onSuccess?: () => void }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId, name, date, time }),
      });
      if (!res.ok) throw new Error("Gagal membuat booking");
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm">Nama</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">Tanggal</label>
          <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Waktu</label>
          <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex justify-between items-center">
        <div className="text-sm text-zinc-600">Total: —</div>
        <div>
          <button type="button" onClick={() => { setName(""); setDate(""); setTime(""); }} className="mr-3 text-sm text-zinc-600">
            Reset
          </button>
          <button disabled={loading} type="submit" className="rounded bg-green-600 px-4 py-2 text-white">
            {loading ? "Memproses..." : "Konfirmasi Booking"}
          </button>
        </div>
      </div>
    </form>
  );
}
