'use client';

import { useState, useEffect } from 'react';

export default function BroadcastManagement() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({ id_admin: '', judul: '', isi: '', tanggal_kirim: '', tipe_penerima: 'all' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBroadcasts();
    fetchAdmins();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const res = await fetch('/api/broadcast');
      const data = await res.json();
      if (data.success) setBroadcasts(data.data);
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      if (data.success) setAdmins(data.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ id_admin: '', judul: '', isi: '', tanggal_kirim: '', tipe_penerima: 'all' });
        fetchBroadcasts();
      }
    } catch (error) {
      console.error('Error creating broadcast:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        const res = await fetch(`/api/broadcast/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) fetchBroadcasts();
      } catch (error) {
        console.error('Error deleting broadcast:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Broadcast Management</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <select value={formData.id_admin} onChange={(e) => setFormData({...formData, id_admin: e.target.value})} className="border p-2 rounded" required>
            <option value="">Select Admin</option>
            {admins.map(a => <option key={a.id_admin} value={a.id_admin}>{a.nama}</option>)}
          </select>
          <select value={formData.tipe_penerima} onChange={(e) => setFormData({...formData, tipe_penerima: e.target.value})} className="border p-2 rounded">
            <option value="all">All Users</option>
            <option value="pelanggan">Customers</option>
            <option value="mitra">Mitra</option>
          </select>
          <input type="text" placeholder="Judul" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} className="border p-2 rounded col-span-2" required />
          <textarea placeholder="Isi" value={formData.isi} onChange={(e) => setFormData({...formData, isi: e.target.value})} className="border p-2 rounded col-span-2" required />
          <input type="date" value={formData.tanggal_kirim} onChange={(e) => setFormData({...formData, tanggal_kirim: e.target.value})} className="border p-2 rounded" required />
        </div>
        <button type="submit" disabled={loading} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
          {loading ? 'Loading...' : 'Send Broadcast'}
        </button>
      </form>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Admin</th>
            <th className="border p-2">Judul</th>
            <th className="border p-2">Tipe Penerima</th>
            <th className="border p-2">Tanggal Kirim</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {broadcasts.map(bc => (
            <tr key={bc.id_broadcast} className="hover:bg-gray-100">
              <td className="border p-2">{bc.id_broadcast}</td>
              <td className="border p-2">{bc.nama}</td>
              <td className="border p-2">{bc.judul}</td>
              <td className="border p-2">{bc.tipe_penerima}</td>
              <td className="border p-2">{bc.tanggal_kirim}</td>
              <td className="border p-2">
                <button onClick={() => handleDelete(bc.id_broadcast)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
