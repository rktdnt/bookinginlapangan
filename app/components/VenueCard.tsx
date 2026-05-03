import React from "react";

type Venue = { id: string; name: string; image: string; price: number; location: string };

export default function VenueCard({ venue }: { venue: Venue }) {
  return (
    <article className="group overflow-hidden rounded-[20px] sm:rounded-[24px] border border-[var(--border)] bg-white shadow-[0_8px_20px_rgba(18,24,38,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(18,24,38,0.12)] active:shadow-[0_4px_12px_rgba(18,24,38,0.08)]">
      <div className="relative h-40 sm:h-48 md:h-52 overflow-hidden bg-gradient-to-br from-emerald-100 via-sky-100 to-amber-100">
        <img src={venue.image} alt={venue.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 sm:left-4 sm:top-4 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-[var(--primary)] shadow-sm backdrop-blur">
          Available now
        </div>
      </div>
      <div className="space-y-3 p-3 sm:space-y-4 sm:p-4 md:p-5">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base sm:text-lg font-bold text-[var(--foreground)]">{venue.name}</h3>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-600 truncate">{venue.location}</p>
          </div>
          <div className="flex-shrink-0 rounded-xl sm:rounded-2xl bg-emerald-500 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-sm whitespace-nowrap">
            Rp {venue.price.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-500 gap-2">
          <span className="truncate">Futsal • Mini Soccer</span>
          <span className="font-medium text-emerald-600 flex-shrink-0">Open</span>
        </div>
      </div>
    </article>
  );
}
