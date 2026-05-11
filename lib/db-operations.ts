import { query } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";

// Admin Operations
export async function createAdmin(data) {
  const hashedPassword = hashPassword(data.password);
  return query(
    "INSERT INTO admin (nama, email, password, no_hp) VALUES (?, ?, ?, ?)",
    [data.nama, data.email, hashedPassword, data.no_hp]
  );
}

export async function getAdminByEmail(email) {
  const result = await query("SELECT * FROM admin WHERE email = ?", [email]);
  return result.length > 0 ? result[0] : null;
}

// Mitra Operations
export async function createMitra(data) {
  const hashedPassword = hashPassword(data.password);
  return query(
    "INSERT INTO mitra (nama_mitra, alamat, no_hp, email, password) VALUES (?, ?, ?, ?, ?)",
    [data.nama_mitra, data.alamat, data.no_hp, data.email, hashedPassword]
  );
}

export async function getMitraByEmail(email) {
  const result = await query("SELECT * FROM mitra WHERE email = ?", [email]);
  return result.length > 0 ? result[0] : null;
}

// Pelanggan Operations
export async function createPelanggan(data) {
  const hashedPassword = hashPassword(data.password);
  return query(
    "INSERT INTO pelanggan (nama, email, password, no_hp, alamat) VALUES (?, ?, ?, ?, ?)",
    [data.nama, data.email, hashedPassword, data.no_hp, data.alamat]
  );
}

export async function getPelangganByEmail(email) {
  const result = await query("SELECT * FROM pelanggan WHERE email = ?", [email]);
  return result.length > 0 ? result[0] : null;
}

// Lapangan Operations
export async function createLapangan(data) {
  return query(
    "INSERT INTO lapangan (id_mitra, nama_lapangan, jenis_olahraga, lokasi, harga, status_ketersediaan, deskripsi, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [data.id_mitra, data.nama_lapangan, data.jenis_olahraga, data.lokasi, data.harga, data.status_ketersediaan || 'available', data.deskripsi, data.foto]
  );
}

export async function getLapanganByMitra(id_mitra) {
  return query("SELECT * FROM lapangan WHERE id_mitra = ?", [id_mitra]);
}

// Order Operations
export async function createOrder(data) {
  return query(
    "INSERT INTO orders (id_pelanggan, id_lapangan, tanggal_pesan, jadwal_main, durasi, total_harga, status_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [data.id_pelanggan, data.id_lapangan, data.tanggal_pesan, data.jadwal_main, data.durasi, data.total_harga, data.status_order || 'pending']
  );
}

export async function getOrdersByPelanggan(id_pelanggan) {
  return query("SELECT o.*, l.nama_lapangan FROM orders o JOIN lapangan l ON o.id_lapangan = l.id_lapangan WHERE o.id_pelanggan = ?", [id_pelanggan]);
}

// Payment Operations
export async function createPayment(data) {
  return query(
    "INSERT INTO pembayaran (id_order, metode_pembayaran, tanggal_bayar, status_pembayaran, jumlah_bayar, bukti_pembayaran) VALUES (?, ?, ?, ?, ?, ?)",
    [data.id_order, data.metode_pembayaran, data.tanggal_bayar, data.status_pembayaran || 'pending', data.jumlah_bayar, data.bukti_pembayaran]
  );
}

export async function getPaymentByOrder(id_order) {
  const result = await query("SELECT * FROM pembayaran WHERE id_order = ?", [id_order]);
  return result.length > 0 ? result[0] : null;
}

// Review Operations
export async function createReview(data) {
  return query(
    "INSERT INTO review (id_pelanggan, id_mitra, rating, komentar, tanggal_review) VALUES (?, ?, ?, ?, ?)",
    [data.id_pelanggan, data.id_mitra, data.rating, data.komentar, data.tanggal_review]
  );
}

export async function getReviewsByMitra(id_mitra) {
  return query("SELECT * FROM review WHERE id_mitra = ?", [id_mitra]);
}

// Customer Service Operations
export async function createCustomerService(data) {
  return query(
    "INSERT INTO customer_service (id_pelanggan, id_mitra, pesan, tanggal, status_keluhan) VALUES (?, ?, ?, ?, ?)",
    [data.id_pelanggan || null, data.id_mitra || null, data.pesan, data.tanggal, data.status_keluhan || 'open']
  );
}

// Broadcast Operations
export async function createBroadcast(data) {
  return query(
    "INSERT INTO broadcast (id_admin, judul, isi, tanggal_kirim, tipe_penerima) VALUES (?, ?, ?, ?, ?)",
    [data.id_admin, data.judul, data.isi, data.tanggal_kirim, data.tipe_penerima || 'all']
  );
}
