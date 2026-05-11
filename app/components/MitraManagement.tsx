'use client';

import { useState, useEffect } from 'react';

export default function MitraManagement() {
  const [mitra, setMitra] = useState([]);
  const [formData, setFormData] = useState({ nama_mitra: '', alamat: '', no_hp: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMitra();
  }, []);

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
      const res = await fetch('/api/mitra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ nama_mitra: '', alamat: '', no_hp: '', email: '', password: '' });
        fetchMitra();
      }
    } catch (error) {
      console.error('Error creating mitra:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        const res = await fetch(`/api/mitra/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) fetchMitra();
      } catch (error) {
        console.error('Error deleting mitra:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mitra Management</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Nama Mitra" value={formData.nama_mitra} onChange={(e) => setFormData({...formData, nama_mitra: e.target.value})} className="border p-2 rounded" required />
          <input type="text" placeholder="Alamat" value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="border p-2 rounded" />
          <input type="tel" placeholder="No HP" value={formData.no_hp} onChange={(e) => setFormData({...formData, no_hp: e.target.value})} className="border p-2 rounded" />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border p-2 rounded" required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="border p-2 rounded" required />
        </div>
        <button type="submit" disabled={loading} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
          {loading ? 'Loading...' : 'Add Mitra'}
        </button>
      </form>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Alamat</th>
            <th className="border p-2">No HP</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mitra.map(m => (
            <tr key={m.id_mitra} className="hover:bg-gray-100">
              <td className="border p-2">{m.id_mitra}</td>
              <td className="border p-2">{m.nama_mitra}</td>
              <td className="border p-2">{m.alamat}</td>
              <td className="border p-2">{m.no_hp}</td>
              <td className="border p-2">{m.email}</td>
              <td className="border p-2">{m.status}</td>
              <td className="border p-2">
                <button onClick={() => handleDelete(m.id_mitra)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
