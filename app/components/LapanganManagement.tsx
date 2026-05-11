'use client';

import { useState, useEffect } from 'react';

export default function LapanganManagement() {
  const [lapangan, setLapangan] = useState([]);
  const [mitra, setMitra] = useState([]);
  const [formData, setFormData] = useState({ id_mitra: '', nama_lapangan: '', jenis_olahraga: '', lokasi: '', harga: '', deskripsi: '', foto: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLapangan();
    fetchMitra();
  }, []);

  const fetchLapangan = async () => {
    try {
      const res = await fetch('/api/lapangan');
      const data = await res.json();
      if (data.success) setLapangan(data.data);
    } catch (error) {
      console.error('Error fetching lapangan:', error);
    }
  };

  const fetchMitra = async () => {
    try {
      const res = await fetch('/api/mitra');
      const data = await res.json();
      if (data.success) setMitra(data.data);
    } catch (error) {
      console.error('Error fetching mitra:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/lapangan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ id_mitra: '', nama_lapangan: '', jenis_olahraga: '', lokasi: '', harga: '', deskripsi: '', foto: '' });
        fetchLapangan();
      }
    } catch (error) {
      console.error('Error creating lapangan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        const res = await fetch(`/api/lapangan/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) fetchLapangan();
      } catch (error) {
        console.error('Error deleting lapangan:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Lapangan Management</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <select value={formData.id_mitra} onChange={(e) => setFormData({...formData, id_mitra: e.target.value})} className="border p-2 rounded" required>
            <option value="">Select Mitra</option>
            {mitra.map(m => <option key={m.id_mitra} value={m.id_mitra}>{m.nama_mitra}</option>)}
          </select>
          <input type="text" placeholder="Nama Lapangan" value={formData.nama_lapangan} onChange={(e) => setFormData({...formData, nama_lapangan: e.target.value})} className="border p-2 rounded" required />
          <input type="text" placeholder="Jenis Olahraga" value={formData.jenis_olahraga} onChange={(e) => setFormData({...formData, jenis_olahraga: e.target.value})} className="border p-2 rounded" />
          <input type="text" placeholder="Lokasi" value={formData.lokasi} onChange={(e) => setFormData({...formData, lokasi: e.target.value})} className="border p-2 rounded" />
          <input type="number" placeholder="Harga" value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} className="border p-2 rounded" required />
          <input type="text" placeholder="Foto URL" value={formData.foto} onChange={(e) => setFormData({...formData, foto: e.target.value})} className="border p-2 rounded" />
          <textarea placeholder="Deskripsi" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} className="border p-2 rounded col-span-2" />
        </div>
        <button type="submit" disabled={loading} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
          {loading ? 'Loading...' : 'Add Lapangan'}
        </button>
      </form>

      <table className="w-full border-collapse border overflow-x-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Jenis</th>
            <th className="border p-2">Lokasi</th>
            <th className="border p-2">Harga</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lapangan.map(l => (
            <tr key={l.id_lapangan} className="hover:bg-gray-100">
              <td className="border p-2">{l.id_lapangan}</td>
              <td className="border p-2">{l.nama_lapangan}</td>
              <td className="border p-2">{l.jenis_olahraga}</td>
              <td className="border p-2">{l.lokasi}</td>
              <td className="border p-2">Rp {l.harga?.toLocaleString('id-ID')}</td>
              <td className="border p-2">{l.status_ketersediaan}</td>
              <td className="border p-2">
                <button onClick={() => handleDelete(l.id_lapangan)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
