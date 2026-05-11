-- Complete booking system schema
-- This migration adds all tables for the comprehensive booking system

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
  id_admin INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  no_hp VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Mitra (Partner/Venue Owner) table
CREATE TABLE IF NOT EXISTS mitra (
  id_mitra INT AUTO_INCREMENT PRIMARY KEY,
  nama_mitra VARCHAR(100) NOT NULL,
  alamat TEXT,
  no_hp VARCHAR(20),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pelanggan (Customer) table
CREATE TABLE IF NOT EXISTS pelanggan (
  id_pelanggan INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  no_hp VARCHAR(20),
  alamat TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Lapangan (Field/Court) table
CREATE TABLE IF NOT EXISTS lapangan (
  id_lapangan INT AUTO_INCREMENT PRIMARY KEY,
  id_mitra INT NOT NULL,
  nama_lapangan VARCHAR(100) NOT NULL,
  jenis_olahraga VARCHAR(50),
  lokasi TEXT,
  harga DECIMAL(10,2),
  status_ketersediaan VARCHAR(50) DEFAULT 'available',
  deskripsi TEXT,
  foto VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_mitra) REFERENCES mitra(id_mitra) ON DELETE CASCADE
);

-- Orders (Bookings) table
CREATE TABLE IF NOT EXISTS orders (
  id_order INT AUTO_INCREMENT PRIMARY KEY,
  id_pelanggan INT NOT NULL,
  id_lapangan INT NOT NULL,
  tanggal_pesan DATE NOT NULL,
  jadwal_main DATETIME NOT NULL,
  durasi INT NOT NULL,
  total_harga DECIMAL(10,2) NOT NULL,
  status_order VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pelanggan) REFERENCES pelanggan(id_pelanggan) ON DELETE CASCADE,
  FOREIGN KEY (id_lapangan) REFERENCES lapangan(id_lapangan) ON DELETE CASCADE
);

-- Pembayaran (Payment) table
CREATE TABLE IF NOT EXISTS pembayaran (
  id_pembayaran INT AUTO_INCREMENT PRIMARY KEY,
  id_order INT UNIQUE NOT NULL,
  metode_pembayaran VARCHAR(50),
  tanggal_bayar DATE,
  status_pembayaran VARCHAR(50) DEFAULT 'pending',
  jumlah_bayar DECIMAL(10,2),
  bukti_pembayaran VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_order) REFERENCES orders(id_order) ON DELETE CASCADE
);

-- Review table
CREATE TABLE IF NOT EXISTS review (
  id_review INT AUTO_INCREMENT PRIMARY KEY,
  id_pelanggan INT NOT NULL,
  id_mitra INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  komentar TEXT,
  tanggal_review DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pelanggan) REFERENCES pelanggan(id_pelanggan) ON DELETE CASCADE,
  FOREIGN KEY (id_mitra) REFERENCES mitra(id_mitra) ON DELETE CASCADE
);

-- Riwayat (History) table
CREATE TABLE IF NOT EXISTS riwayat (
  id_riwayat INT AUTO_INCREMENT PRIMARY KEY,
  id_order INT UNIQUE NOT NULL,
  status_akhir VARCHAR(50),
  tanggal_selesai DATE,
  catatan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_order) REFERENCES orders(id_order) ON DELETE CASCADE
);

-- Broadcast table
CREATE TABLE IF NOT EXISTS broadcast (
  id_broadcast INT AUTO_INCREMENT PRIMARY KEY,
  id_admin INT NOT NULL,
  judul VARCHAR(100) NOT NULL,
  isi TEXT NOT NULL,
  tanggal_kirim DATE,
  tipe_penerima VARCHAR(50) DEFAULT 'all',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_admin) REFERENCES admin(id_admin) ON DELETE CASCADE
);

-- Customer Service table
CREATE TABLE IF NOT EXISTS customer_service (
  id_cs INT AUTO_INCREMENT PRIMARY KEY,
  id_pelanggan INT,
  id_mitra INT,
  pesan TEXT NOT NULL,
  tanggal DATE,
  status_keluhan VARCHAR(50) DEFAULT 'open',
  respons_admin TEXT,
  tanggal_respons DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pelanggan) REFERENCES pelanggan(id_pelanggan) ON DELETE SET NULL,
  FOREIGN KEY (id_mitra) REFERENCES mitra(id_mitra) ON DELETE SET NULL
);

-- Create indices for better performance (with IF NOT EXISTS for idempotency)
CREATE INDEX IF NOT EXISTS idx_lapangan_mitra ON lapangan(id_mitra);
CREATE INDEX IF NOT EXISTS idx_orders_pelanggan ON orders(id_pelanggan);
CREATE INDEX IF NOT EXISTS idx_orders_lapangan ON orders(id_lapangan);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status_order);
CREATE INDEX IF NOT EXISTS idx_pembayaran_order ON pembayaran(id_order);
CREATE INDEX IF NOT EXISTS idx_review_pelanggan ON review(id_pelanggan);
CREATE INDEX IF NOT EXISTS idx_review_mitra ON review(id_mitra);
CREATE INDEX IF NOT EXISTS idx_broadcast_admin ON broadcast(id_admin);
CREATE INDEX IF NOT EXISTS idx_customer_service_pelanggan ON customer_service(id_pelanggan);
CREATE INDEX IF NOT EXISTS idx_customer_service_mitra ON customer_service(id_mitra);
CREATE INDEX IF NOT EXISTS idx_customer_service_status ON customer_service(status_keluhan);
