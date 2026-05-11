'use client';

import { useState, useEffect } from 'react';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_order: newStatus }),
      });
      const data = await res.json();
      if (data.success) fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>
      
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Lapangan</th>
            <th className="border p-2">Jadwal</th>
            <th className="border p-2">Total Harga</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id_order} className="hover:bg-gray-100">
              <td className="border p-2">{order.id_order}</td>
              <td className="border p-2">{order.nama}</td>
              <td className="border p-2">{order.nama_lapangan}</td>
              <td className="border p-2">{new Date(order.jadwal_main).toLocaleString('id-ID')}</td>
              <td className="border p-2">Rp {order.total_harga?.toLocaleString('id-ID')}</td>
              <td className="border p-2">
                <select value={order.status_order} onChange={(e) => handleStatusChange(order.id_order, e.target.value)} disabled={loading} className="border p-1 rounded">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="border p-2">
                <button onClick={() => handleDelete(order.id_order)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
