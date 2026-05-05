"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import VenueCard from "../components/VenueCard";
import UserMenu from "../components/UserMenu";

type Venue = { id: string; name: string; image: string; price: number; location: string };

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/venues")
      .then((r) => r.json())
      .then((data) => setVenues(data))
      .catch(() => setVenues([]))
      .finally(() => setLoading(false));
  }, []);

  // check auth state to show/hide Masuk/Daftar
  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => { if (mounted && d?.user) setUser(d.user); })
      .catch(() => {})
    return () => { mounted = false };
  }, []);

  const filtered = venues.filter((v) => v.name.toLowerCase().includes(query.toLowerCase()) || v.location.toLowerCase().includes(query.toLowerCase()));
  const totalCities = new Set(venues.map((venue) => venue.location)).size;

  return (
    <div className="min-h-screen pb-12">
      <header className="site-header sticky top-0 z-40">
        <div className="section-shell flex items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:px-6 md:py-4">
          <Link href="/" className="block shrink-0">
            <img
              src="/BookinginLapangan.svg"
              alt="bookinginlapangan"
              className="h-12 w-auto select-none sm:h-14 md:h-20"
            />
          </Link>
          <div className="flex gap-2 sm:gap-3">
            {user ? <UserMenu /> : (
              <>
                <Link href="/login" className="whitespace-nowrap rounded-full border border-[var(--primary)]/15 bg-white px-3 py-2 text-xs font-medium text-[var(--primary)] transition hover:bg-zinc-50 sm:px-4 sm:text-sm">
                  Masuk
                </Link>
                <Link href="/register" className="whitespace-nowrap rounded-full bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-black transition hover:opacity-95 sm:px-4 sm:text-sm">
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="brand-banner">
        <div className="section-shell grid gap-6 px-3 py-6 sm:gap-8 sm:px-4 sm:py-8 md:px-6 md:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">BookinginLapangan</p>
            <h1 className="soft-title mt-2 text-2xl font-black text-white sm:mt-3 sm:text-3xl md:text-5xl">Booking lapangan jadi lebih cepat, rapi, dan nyaman.</h1>
            <p className="mt-3 max-w-2xl text-xs leading-6 text-white/80 sm:mt-4 sm:text-sm md:text-base md:leading-7">Cari venue, bandingkan lokasi, dan atur jadwal booking dengan tampilan yang lebih modern dan mudah dipahami.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:justify-self-end lg:min-w-[420px] auto-rows-max">
            <div className="rounded-2xl bg-white/12 p-3 text-white backdrop-blur sm:p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Venue</p>
              <p className="mt-1 text-xl font-black sm:mt-2 sm:text-2xl">{venues.length}</p>
            </div>
            <div className="rounded-2xl bg-white/12 p-3 text-white backdrop-blur sm:p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Kota</p>
              <p className="mt-1 text-xl font-black sm:mt-2 sm:text-2xl">{totalCities}</p>
            </div>
            <div className="rounded-2xl bg-white/12 p-3 text-white backdrop-blur sm:p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Booking</p>
              <p className="mt-1 text-xl font-black sm:mt-2 sm:text-2xl">3 langkah</p>
            </div>
          </div>
        </div>
      </section>

      <main className="section-shell px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-10">
        <div className="control-panel p-3 sm:p-4 md:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--primary)] sm:text-sm">Discover venue</p>
              <h2 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:mt-2 sm:text-2xl">Temukan lapangan yang paling pas</h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="filter-chip p-2 sm:p-3" title="Filter options">⚙</button>
              <button className="rounded-full px-3 py-2 text-xs font-semibold search-primary sm:px-5 sm:py-3 sm:text-sm">Cari venue</button>
            </div>
          </div>

          <div className="grid gap-2 sm:gap-3 lg:grid-cols-[1.4fr_0.8fr_0.9fr]">
            <div className="filter-chip flex items-center gap-2 p-2.5 sm:p-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-70 flex-shrink-0"><path d="M10 2v11l3 3v6l4-2v-4l3-3V2H10z" fill="#bbb"/></svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama venue"
                className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
              />
            </div>
            <div className="filter-chip flex items-center gap-2 p-2.5 sm:p-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0"><circle cx="12" cy="12" r="10" stroke="#bbb"/></svg>
              <select className="min-w-0 w-full bg-transparent text-sm outline-none text-zinc-500">
                <option>Pilih Kota</option>
              </select>
            </div>
            <div className="filter-chip flex items-center gap-2 p-2.5 sm:p-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 6 6 .5-4.5 4 1 6L12 16l-5.5 3.5 1-6L3 8.5 9 8 12 2z" stroke="#bbb"/></svg>
              <select className="w-full bg-transparent outline-none text-zinc-500">
                <option>Pilih Cabang Olahraga</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 px-1 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500 sm:text-sm">Menampilkan <span className="font-bold text-[var(--foreground)]">{filtered.length} venue</span> tersedia</p>
          <p className="text-xs text-zinc-500 sm:text-sm">Urutkan berdasarkan: <span className="font-semibold text-[var(--foreground)]">Populer</span></p>
        </div>

        {loading ? (
          <p className="mt-8 text-center text-sm text-zinc-500">Loading...</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-7">
            {filtered.map((v) => (
              <Link key={v.id} href={`/venues/${v.id}`} className="block">
                <VenueCard venue={v} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
