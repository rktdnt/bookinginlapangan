import React from "react";

type Venue = { id: string; name: string; image: string; price: number; location: string };

export default function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className="group rounded-lg border p-3 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-3 h-40 w-full overflow-hidden rounded bg-zinc-100">
        <img src={venue.image} alt={venue.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{venue.name}</h3>
          <p className="text-sm text-zinc-600">{venue.location}</p>
        </div>
        <div className="ml-4 rounded bg-emerald-600 px-3 py-1 text-sm font-semibold text-white">
          Rp {venue.price.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
