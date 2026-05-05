import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { query } from "../../lib/db";
import { SESSION_COOKIE_NAME, hashSessionToken } from "../../lib/auth";
import AdminBookingActions from "../components/AdminBookingActions";

export default async function AdminPage() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) redirect("/");

  const tokenHash = hashSessionToken(token as string);
  const rows = (await query(
    `SELECT u.id, u.name, u.email
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  )) as any[];

  const user = rows[0];
  const isAdmin = (process.env.ADMIN_EMAIL && user?.email === process.env.ADMIN_EMAIL) || user?.id === 1;
  if (!user || !isAdmin) redirect("/");

  // Fetch comprehensive stats
  const statsResult = await query(
    `SELECT 
      (SELECT COUNT(*) FROM venues) as total_venues,
      (SELECT COUNT(*) FROM bookings) as total_bookings,
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') as confirmed_bookings,
      (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
      (SELECT COUNT(*) FROM bookings WHERE status = 'cancelled') as cancelled_bookings,
      (SELECT SUM(CAST(REPLACE(price, '.', '') as UNSIGNED)) FROM (
        SELECT DISTINCT b.id, v.price FROM bookings b 
        JOIN venues v ON b.venue_id = v.id 
        WHERE b.status = 'confirmed'
      ) as confirmed_revenue) as total_revenue
    `
  ) as any[];

  const stats = statsResult[0] || {};

  // Fetch recent bookings
  const recentBookings = await query(
    `SELECT b.id, b.customer_name, b.booking_date, b.booking_time, b.status, b.payment_method, b.payment_proof_path, v.name as venue_name
     FROM bookings b
     JOIN venues v ON b.venue_id = v.id
     ORDER BY b.created_at DESC
     LIMIT 10`
  ) as any[];

  const formattedDate = new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const formatBookingDate = (value: unknown) => {
    if (!value) return "-";
    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[var(--foreground)]">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600">Halo, <span className="font-semibold text-[var(--foreground)]">{user.name}</span> • {formattedDate}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Venues */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Total Venues</p>
                <p className="mt-3 text-4xl font-black text-[var(--foreground)]">{stats.total_venues || 0}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.581m0 0H9m5.581 0a2 2 0 100-4h-.581m0 4a2 2 0 100-4h.581m0 0H9m-5.581 0a2 2 0 000 4h.581m0-4a2 2 0 000 4H9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Total Bookings</p>
                <p className="mt-3 text-4xl font-black text-[var(--primary)]">{stats.total_bookings || 0}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Total Users</p>
                <p className="mt-3 text-4xl font-black text-green-600">{stats.total_users || 0}</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a7 7 0 1114 0" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Total Revenue</p>
                <p className="mt-3 text-2xl font-black text-amber-600">
                  {stats.total_revenue ? `Rp ${Math.floor(stats.total_revenue / 1000)}K` : "Rp 0"}
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 p-3">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {/* Confirmed */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-green-700">Confirmed</p>
            <p className="mt-2 text-3xl font-black text-green-700">{stats.confirmed_bookings || 0}</p>
            <p className="mt-1 text-xs text-green-600">Bookings confirmed</p>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-yellow-700">Pending</p>
            <p className="mt-2 text-3xl font-black text-yellow-700">{stats.pending_bookings || 0}</p>
            <p className="mt-1 text-xs text-yellow-600">Awaiting payment</p>
          </div>

          {/* Cancelled */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-700">Cancelled</p>
            <p className="mt-2 text-3xl font-black text-red-700">{stats.cancelled_bookings || 0}</p>
            <p className="mt-1 text-xs text-red-600">Cancelled bookings</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-zinc-200 px-6 py-4">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Recent Bookings</h2>
            <p className="mt-1 text-xs text-zinc-600">Latest 10 bookings from the system</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-zinc-700">Customer</th>
                  <th className="px-6 py-3 text-left font-semibold text-zinc-700">Venue</th>
                  <th className="px-6 py-3 text-left font-semibold text-zinc-700">Date & Time</th>
                  <th className="px-6 py-3 text-left font-semibold text-zinc-700">Payment</th>
                  <th className="px-6 py-3 text-left font-semibold text-zinc-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-zinc-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking: any) => (
                    <tr key={booking.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition">
                      <td className="px-6 py-4 font-medium text-[var(--foreground)]">{booking.customer_name}</td>
                      <td className="px-6 py-4 text-zinc-700">{booking.venue_name}</td>
                      <td className="px-6 py-4 text-zinc-600 text-xs">
                        <div>{formatBookingDate(booking.booking_date)}</div>
                        <div className="text-zinc-500">{booking.booking_time}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-600">
                        <div className="font-medium text-zinc-800">{String(booking.payment_method || "-").toUpperCase()}</div>
                        {booking.payment_proof_path ? (
                          <a href={booking.payment_proof_path} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[var(--primary)] hover:underline">
                            Lihat bukti
                          </a>
                        ) : (
                          <div className="mt-1 text-zinc-400">-</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <AdminBookingActions bookingId={String(booking.id)} status={String(booking.status)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      No bookings yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
