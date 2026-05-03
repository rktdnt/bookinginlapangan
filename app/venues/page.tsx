"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import VenueCard from "../components/VenueCard";

type Venue = { id: string; name: string; image: string; price: number; location: string };

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/venues")
      .then((r) => r.json())
      .then((data) => setVenues(data))
      .catch(() => setVenues([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = venues.filter((v) => v.name.toLowerCase().includes(query.toLowerCase()) || v.location.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Daftar Lapangan</h1>
        <p className="text-sm text-zinc-600">Pilih lapangan dan lakukan booking mudah.</p>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-1/2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau lokasi"
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <Link key={v.id} href={`/venues/${v.id}`} className="block">
              <VenueCard venue={v} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
