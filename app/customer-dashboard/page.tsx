'use client';

import { useState, useEffect } from 'react';

interface Order {
  id_order: number;
  nama_lapangan: string;
  jadwal_main: string;
  total_harga: number;
  status_order: string;
}

export default function CustomerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pelangganId, setPelangganId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage or session
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setPelangganId(parsedUser.id_pelanggan);
      fetchOrders(parsedUser.id_pelanggan);
    }
  }, []);

  const fetchOrders = async (id: number) => {
    try {
      const res = await fetch(`/api/orders?pelanggan=${id}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: {[key: string]: string} = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading your bookings...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">You haven't made any bookings yet</p>
            <a href="/customer-landing" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Browse Fields
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map(order => (
              <div key={order.id_order} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{order.nama_lapangan}</h2>
                    <p className="text-gray-600">Order ID: {order.id_order}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${getStatusColor(order.status_order)}`}>
                    {order.status_order.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Jadwal Main</p>
                    <p className="font-semibold">{new Date(order.jadwal_main).toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Harga</p>
                    <p className="font-semibold text-blue-600">Rp {order.total_harga?.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="font-semibold">{order.status_order}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    View Details
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
