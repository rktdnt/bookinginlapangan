'use client';

import { useState, useEffect } from 'react';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({ nama: '', email: '', password: '', no_hp: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

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
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ nama: '', email: '', password: '', no_hp: '' });
        fetchAdmins();
      }
    } catch (error) {
      console.error('Error creating admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        const res = await fetch(`/api/admin/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) fetchAdmins();
      } catch (error) {
        console.error('Error deleting admin:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Management</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Nama" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="border p-2 rounded" required />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border p-2 rounded" required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="border p-2 rounded" required />
          <input type="tel" placeholder="No HP" value={formData.no_hp} onChange={(e) => setFormData({...formData, no_hp: e.target.value})} className="border p-2 rounded" />
        </div>
        <button type="submit" disabled={loading} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
          {loading ? 'Loading...' : 'Add Admin'}
        </button>
      </form>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">No HP</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id_admin} className="hover:bg-gray-100">
              <td className="border p-2">{admin.id_admin}</td>
              <td className="border p-2">{admin.nama}</td>
              <td className="border p-2">{admin.email}</td>
              <td className="border p-2">{admin.no_hp}</td>
              <td className="border p-2">
                <button onClick={() => handleDelete(admin.id_admin)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
