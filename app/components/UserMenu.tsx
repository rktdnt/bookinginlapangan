"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => { if (d?.user) setUser(d.user); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((d) => { if (d?.bookings) setBookings(d.bookings); })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!(e.target instanceof Node)) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  async function handleLogout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {}

    setOpen(false);
    setUser(null);
    setBookings([]);
    router.replace('/');
    router.refresh();
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link href="/login" className="whitespace-nowrap rounded-full border border-[var(--primary)]/15 bg-white px-3 py-2 text-xs font-medium text-[var(--primary)] transition hover:bg-zinc-50 sm:px-4 sm:text-sm">
          Masuk
        </Link>
        <Link href="/register" className="whitespace-nowrap rounded-full bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-black transition hover:opacity-95 sm:px-4 sm:text-sm">
          Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((s) => !s)} className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-sm">
        <span className="font-semibold">{user.name}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-[var(--border)] bg-white shadow-lg z-50">
          <div className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
            </div>

            <div className="mb-2">
              <p className="mb-1 text-xs font-semibold text-zinc-500">Booking Saya</p>
              {loading ? (
                <p className="text-sm text-zinc-500">Memuat...</p>
              ) : bookings.length === 0 ? (
                <p className="text-sm text-zinc-500">Belum ada booking</p>
              ) : (
                <ul className="max-h-44 overflow-auto space-y-2">
                  {bookings.map((b) => (
                    <li key={b.id} className="flex items-center gap-3 rounded-md p-2 hover:bg-zinc-50">
                      <img src={b.venue_image || '/images/placeholder.svg'} alt="" className="h-10 w-10 rounded-md object-cover" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{b.venue_name || b.venue_id}</div>
                        <div className="text-xs text-zinc-500">{b.booking_date} · {b.booking_time}</div>
                      </div>
                      <div className="text-xs text-zinc-500">{b.status}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {user.isAdmin ? (
                <Link href="/admin" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-50">Admin Dashboard</Link>
              ) : null}
              <form onSubmit={handleLogout}>
                <button type="submit" className="w-full rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white">Logout</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
