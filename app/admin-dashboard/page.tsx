'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');

  const stats = [
    { label: 'Total Admins', icon: '👤', color: 'bg-blue-500' },
    { label: 'Total Mitra', icon: '🏪', color: 'bg-green-500' },
    { label: 'Total Pelanggan', icon: '👥', color: 'bg-purple-500' },
    { label: 'Total Orders', icon: '📋', color: 'bg-orange-500' },
  ];

  const menuItems = [
    { id: 'admin', label: 'Admin Management', icon: '👤' },
    { id: 'mitra', label: 'Mitra Management', icon: '🏪' },
    { id: 'lapangan', label: 'Lapangan Management', icon: '⚽' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'review', label: 'Reviews', icon: '⭐' },
    { id: 'broadcast', label: 'Broadcast', icon: '📢' },
    { id: 'customer-service', label: 'Customer Service', icon: '💬' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
          <p className="text-gray-600 text-sm">Booking Lapangan System</p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left px-6 py-3 flex items-center gap-3 transition ${
                activeSection === item.id
                  ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t bg-gray-50">
          <Link href="/api/auth/logout" className="text-red-500 hover:text-red-600 font-medium">
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeSection === 'overview' && (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>
            <div className="grid grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className={`${stat.color} text-white rounded-lg shadow p-6`}>
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <p className="text-3xl font-bold">-</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded transition"
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">System Information</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>System:</strong> Booking Lapangan</p>
                  <p><strong>Version:</strong> 1.0.0</p>
                  <p><strong>Database:</strong> MySQL</p>
                  <p><strong>Framework:</strong> Next.js 16</p>
                  <p><strong>Status:</strong> <span className="text-green-600">Active</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'admin' && (
          <div className="dynamic-content">
            {/* Admin Component will be mounted here */}
            <iframe src="/admin/management" className="w-full h-screen border-0" />
          </div>
        )}
      </div>
    </div>
  );
}
