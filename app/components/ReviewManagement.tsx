'use client';

import { useState, useEffect } from 'react';

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/review');
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        const res = await fetch(`/api/review/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Review Management</h1>
      
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Mitra</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Komentar</th>
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(review => (
            <tr key={review.id_review} className="hover:bg-gray-100">
              <td className="border p-2">{review.id_review}</td>
              <td className="border p-2">{review.nama_pelanggan}</td>
              <td className="border p-2">{review.nama_mitra}</td>
              <td className="border p-2">{renderStars(review.rating)}</td>
              <td className="border p-2">{review.komentar}</td>
              <td className="border p-2">{review.tanggal_review}</td>
              <td className="border p-2">
                <button onClick={() => handleDelete(review.id_review)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
