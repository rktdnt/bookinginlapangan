"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookingForm from "../../components/BookingForm";

type Venue = { id: string; name: string; image: string; price: number; location: string; description?: string };

const amenities = [
  { icon: "🏟️", label: "Lapangan Standar" },
  { icon: "💡", label: "Pencahayaan LED" },
  { icon: "🚿", label: "Kamar Mandi" },
  { icon: "🎒", label: "Ruang Ganti" },
];

export default function VenueDetailPage() {
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"detail" | "fasilitas">("detail");

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">Memuat...</p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-zinc-600 mb-4">Lapangan tidak ditemukan.</p>
        <Link href="/" className="text-[var(--primary)] hover:underline">← Kembali ke beranda</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[var(--border)]">
        <div className="section-shell flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:opacity-80">
            ← Kembali
          </button>
          <Link href="/" className="text-sm font-semibold text-[var(--foreground)]">BookinginLapangan</Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden bg-zinc-200 sm:h-[480px]">
        <img src={venue.image} alt={venue.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="section-shell px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-5xl">
          {/* Title & Quick Info */}
          <div className="mb-8">
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-[var(--foreground)] sm:text-5xl">{venue.name}</h1>
              <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">Populer</span>
            </div>
            <p className="mt-2 text-sm text-zinc-600 sm:text-base">📍 {venue.location}</p>
          </div>

          {/* Main Grid */}
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            {/* Left Content */}
            <div className="md:col-span-2">
              {/* Price & Rating */}
              <div className="mb-8 flex items-end justify-between rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">Harga per jam</p>
                  <p className="mt-1 text-3xl font-black text-[var(--foreground)] sm:text-4xl">Rp {venue.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">⭐</span>
                    <span className="font-bold">4.8</span>
                  </div>
                  <p className="text-xs text-zinc-500">(324 reviews)</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6 flex gap-4 border-b border-[var(--border)]">
                <button
                  onClick={() => setSelectedTab("detail")}
                  className={`pb-3 font-semibold text-sm transition ${
                    selectedTab === "detail"
                      ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                      : "text-zinc-600 hover:text-[var(--foreground)]"
                  }`}
                >
                  Detail
                </button>
                <button
                  onClick={() => setSelectedTab("fasilitas")}
                  className={`pb-3 font-semibold text-sm transition ${
                    selectedTab === "fasilitas"
                      ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                      : "text-zinc-600 hover:text-[var(--foreground)]"
                  }`}
                >
                  Fasilitas
                </button>
              </div>

              {/* Tab Content */}
              {selectedTab === "detail" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">Tentang Lapangan Ini</h3>
                    <p className="text-sm leading-6 text-zinc-700">{venue.description || "Lapangan berkualitas tinggi dengan fasilitas lengkap untuk berbagai jenis olahraga."}</p>
                  </div>
                  <div className="mt-6 grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-2 sm:p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Ukuran Lapangan</p>
                      <p className="mt-2 font-semibold text-[var(--foreground)]">40m × 20m</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Tipe Lapangan</p>
                      <p className="mt-2 font-semibold text-[var(--foreground)]">Sintetis Premium</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Jam Operasional</p>
                      <p className="mt-2 font-semibold text-[var(--foreground)]">06:00 - 22:00</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Minimum Booking</p>
                      <p className="mt-2 font-semibold text-[var(--foreground)]">1 jam</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === "fasilitas" && (
                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">Fasilitas Tersedia</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {amenities.map((a) => (
                      <div key={a.label} className="flex items-center gap-3 rounded-lg bg-white p-4">
                        <span className="text-2xl">{a.icon}</span>
                        <span className="font-medium text-[var(--foreground)]">{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Booking Card */}
            <div>
              <div className="sticky top-24 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">Pesan Sekarang</p>

                <div className="mb-4 space-y-2 rounded-lg bg-[var(--accent)]/10 p-4">
                  <p className="text-xs text-zinc-600">Total Harga</p>
                  <p className="text-2xl font-black text-[var(--primary)]">Rp {venue.price.toLocaleString()}</p>
                  <p className="text-xs text-zinc-500">per 1 jam</p>
                </div>

                <button
                  onClick={() => setShowBooking(true)}
                  className="w-full rounded-lg bg-[linear-gradient(135deg,var(--primary),var(--primary-700))] px-4 py-3 font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-95"
                >
                  Pesan Lapangan
                </button>

                <p className="mt-4 text-center text-xs text-zinc-500">Status tersedia ✓</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--foreground)]">Pesan {venue.name}</h3>
              <button
                onClick={() => setShowBooking(false)}
                className="rounded-full p-2 hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <BookingForm venueId={venue.id} pricePerHour={venue.price} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
