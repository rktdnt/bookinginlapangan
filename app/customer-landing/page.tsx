'use client';

import { useState, useEffect } from 'react';

export default function CustomerLanding() {
  const [lapangan, setLapangan] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLapangan();
  }, []);

  const fetchLapangan = async () => {
    try {
      const res = await fetch('/api/lapangan');
      const data = await res.json();
      if (data.success) {
        setLapangan(data.data);
      }
    } catch (error) {
      console.error('Error fetching lapangan:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLapangan = lapangan.filter(l => {
    const matchSearch = l.nama_lapangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       l.lokasi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchJenis = !filterJenis || l.jenis_olahraga === filterJenis;
    return matchSearch && matchJenis;
  });

  const sportTypes = [...new Set(lapangan.map(l => l.jenis_olahraga))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Booking Lapangan</h1>
          <p className="text-xl opacity-90">Cari dan booking lapangan olahraga terbaik di kota Anda</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Cari lapangan atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
            />
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
            >
              <option value="">Semua Jenis Olahraga</option>
              {sportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button onClick={fetchLapangan} className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </div>

        {/* Lapangan Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading lapangan...</p>
          </div>
        ) : filteredLapangan.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No fields found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLapangan.map(l => (
              <div key={l.id_lapangan} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {l.foto && (
                  <img src={l.foto} alt={l.nama_lapangan} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{l.nama_lapangan}</h3>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-semibold">Jenis:</span> {l.jenis_olahraga}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-semibold">Lokasi:</span> {l.lokasi}
                  </p>
                  <p className="text-gray-700 text-sm mb-3">{l.deskripsi}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      Rp {l.harga?.toLocaleString('id-ID')}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      l.status_ketersediaan === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {l.status_ketersediaan}
                    </span>
                  </div>
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 Booking Lapangan. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
