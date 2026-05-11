'use client';

import { useState, useEffect } from 'react';

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/pembayaran');
      const data = await res.json();
      if (data.success) setPayments(data.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pembayaran/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_pembayaran: newStatus }),
      });
      const data = await res.json();
      if (data.success) fetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Payment Management</h1>
      
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Metode</th>
            <th className="border p-2">Jumlah</th>
            <th className="border p-2">Tanggal Bayar</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id_pembayaran} className="hover:bg-gray-100">
              <td className="border p-2">{payment.id_pembayaran}</td>
              <td className="border p-2">{payment.id_order}</td>
              <td className="border p-2">{payment.metode_pembayaran}</td>
              <td className="border p-2">Rp {payment.jumlah_bayar?.toLocaleString('id-ID')}</td>
              <td className="border p-2">{payment.tanggal_bayar}</td>
              <td className="border p-2">
                <select value={payment.status_pembayaran} onChange={(e) => handleStatusChange(payment.id_pembayaran, e.target.value)} disabled={loading} className="border p-1 rounded">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td className="border p-2">
                <a href={payment.bukti_pembayaran} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
