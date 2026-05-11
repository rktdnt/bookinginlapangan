'use client';

import { useState, useEffect } from 'react';

export default function CustomerServiceManagement() {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({ respons_admin: '', tanggal_respons: '' });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/customer_service');
      const data = await res.json();
      if (data.success) setTickets(data.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleRespond = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/customer_service/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status_keluhan: 'closed',
          respons_admin: formData.respons_admin,
          tanggal_respons: formData.tanggal_respons,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ respons_admin: '', tanggal_respons: '' });
        setSelectedTicket(null);
        fetchTickets();
      }
    } catch (error) {
      console.error('Error responding to ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Service Management</h1>
      
      {selectedTicket && (
        <div className="bg-white p-6 rounded-lg shadow mb-6 border-2 border-blue-500">
          <h2 className="text-xl font-bold mb-4">Respond to Ticket #{selectedTicket.id_cs}</h2>
          <div className="bg-gray-100 p-4 mb-4 rounded">
            <p className="font-bold">Customer: {selectedTicket.nama_pelanggan || 'N/A'}</p>
            <p className="font-bold">Message: {selectedTicket.pesan}</p>
          </div>
          <textarea
            placeholder="Response"
            value={formData.respons_admin}
            onChange={(e) => setFormData({...formData, respons_admin: e.target.value})}
            className="w-full border p-2 rounded mb-2"
            rows={4}
          />
          <input
            type="date"
            value={formData.tanggal_respons}
            onChange={(e) => setFormData({...formData, tanggal_respons: e.target.value})}
            className="border p-2 rounded mb-4"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleRespond(selectedTicket.id_cs)}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading ? 'Sending...' : 'Send Response'}
            </button>
            <button onClick={() => setSelectedTicket(null)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
          </div>
        </div>
      )}

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Message</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id_cs} className={`${ticket.status_keluhan === 'open' ? 'bg-yellow-50' : 'bg-gray-50'} hover:bg-gray-100`}>
              <td className="border p-2">{ticket.id_cs}</td>
              <td className="border p-2">{ticket.nama_pelanggan || 'N/A'}</td>
              <td className="border p-2">{ticket.pesan.substring(0, 50)}...</td>
              <td className="border p-2">
                <span className={`px-3 py-1 rounded ${ticket.status_keluhan === 'open' ? 'bg-yellow-200' : 'bg-green-200'}`}>
                  {ticket.status_keluhan}
                </span>
              </td>
              <td className="border p-2">{ticket.tanggal}</td>
              <td className="border p-2">
                <button
                  onClick={() => setSelectedTicket(ticket)}
                  disabled={ticket.status_keluhan === 'closed'}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {ticket.status_keluhan === 'closed' ? 'Closed' : 'Respond'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
