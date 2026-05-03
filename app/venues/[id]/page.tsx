"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookingForm from "../../components/BookingForm";

type Venue = { id: string; name: string; image: string; price: number; location: string; description?: string };

export default function VenueDetailPage() {
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  // parse id from path
  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split("/");
    const id = parts[parts.length - 1];
    if (!id) return;
    fetch(`/api/venues?id=${id}`)
      .then((r) => r.json())
      .then((data) => setVenue(data))
      .catch(() => setVenue(null))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!venue) return <div className="p-8">Lapangan tidak ditemukan.</div>;

  return (
    <div className="p-4 md:p-8">
      <button className="mb-4 text-sm text-blue-600" onClick={() => router.back()}>
        ← Kembali
      </button>

      <div className="grid gap-6 md:grid-cols-2 md:items-start md:gap-8 max-w-4xl">
        <div>
          <img src={venue.image} alt={venue.name} className="w-full rounded-md object-cover h-56 md:h-72" />
        </div>

        <div>
          <h2 className="text-2xl font-semibold">{venue.name}</h2>
          <p className="text-sm text-zinc-600">{venue.location}</p>
          <p className="mt-4 text-lg font-semibold">Harga: Rp {venue.price.toLocaleString()}</p>
          <p className="mt-4 text-zinc-700">{venue.description || "Tidak ada deskripsi."}</p>

          <div className="mt-6">
            <button
              onClick={() => setShowBooking(true)}
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Booking Sekarang
            </button>
          </div>
        </div>
      </div>

      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Booking untuk {venue.name}</h3>
              <button className="text-sm text-zinc-600" onClick={() => setShowBooking(false)}>
                Tutup
              </button>
            </div>
            <div className="mt-4">
              <BookingForm venueId={venue.id} onSuccess={() => setShowBooking(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
