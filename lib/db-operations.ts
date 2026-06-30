import { getCollection, toObjectId } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";

// ---------------------------------------------------------------------------
// Admin Operations
// ---------------------------------------------------------------------------

export async function createAdmin(data: any) {
  const col = await getCollection("admin");
  const hashedPassword = hashPassword(data.password);
  const result = await col.insertOne({
    nama: data.nama,
    email: data.email,
    password: hashedPassword,
    no_hp: data.no_hp,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return result;
}

export async function getAdminByEmail(email: string) {
  const col = await getCollection("admin");
  return col.findOne({ email });
}

// ---------------------------------------------------------------------------
// Mitra Operations
// ---------------------------------------------------------------------------

export async function createMitra(data: any) {
  const col = await getCollection("mitra");
  const hashedPassword = hashPassword(data.password);
  const result = await col.insertOne({
    nama_mitra: data.nama_mitra,
    alamat: data.alamat,
    no_hp: data.no_hp,
    email: data.email,
    password: hashedPassword,
    status: "active",
    created_at: new Date(),
    updated_at: new Date(),
  });
  return result;
}

export async function getMitraByEmail(email: string) {
  const col = await getCollection("mitra");
  return col.findOne({ email });
}

// ---------------------------------------------------------------------------
// Pelanggan Operations
// ---------------------------------------------------------------------------

export async function createPelanggan(data: any) {
  const col = await getCollection("pelanggan");
  const hashedPassword = hashPassword(data.password);
  const result = await col.insertOne({
    nama: data.nama,
    email: data.email,
    password: hashedPassword,
    no_hp: data.no_hp,
    alamat: data.alamat,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return result;
}

export async function getPelangganByEmail(email: string) {
  const col = await getCollection("pelanggan");
  return col.findOne({ email });
}

// ---------------------------------------------------------------------------
// Lapangan Operations
// ---------------------------------------------------------------------------

export async function createLapangan(data: any) {
  const col = await getCollection("lapangan");
  const mitraId = toObjectId(data.id_mitra);
  const result = await col.insertOne({
    id_mitra: mitraId,
    nama_lapangan: data.nama_lapangan,
    jenis_olahraga: data.jenis_olahraga,
    lokasi: data.lokasi,
    harga: data.harga,
    status_ketersediaan: data.status_ketersediaan || "available",
    deskripsi: data.deskripsi,
    foto: data.foto,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return result;
}

export async function getLapanganByMitra(id_mitra: string) {
  const col = await getCollection("lapangan");
  const mitraId = toObjectId(id_mitra);
  return col.find({ id_mitra: mitraId }).toArray();
}

// ---------------------------------------------------------------------------
// Order Operations
// ---------------------------------------------------------------------------

export async function createOrder(data: any) {
  const col = await getCollection("orders");
  const result = await col.insertOne({
    id_pelanggan: toObjectId(data.id_pelanggan),
    id_lapangan: toObjectId(data.id_lapangan),
    tanggal_pesan: data.tanggal_pesan,
    jadwal_main: data.jadwal_main,
    durasi: data.durasi,
    total_harga: data.total_harga,
    status_order: data.status_order || "pending",
    created_at: new Date(),
    updated_at: new Date(),
  });
  return result;
}

export async function getOrdersByPelanggan(id_pelanggan: string) {
  const db = (await import("@/lib/db")).getDb;
  const dbInstance = await db();
  const result = await dbInstance
    .collection("orders")
    .aggregate([
      { $match: { id_pelanggan: toObjectId(id_pelanggan) } },
      {
        $lookup: {
          from: "lapangan",
          localField: "id_lapangan",
          foreignField: "_id",
          as: "lapangan",
        },
      },
      { $unwind: { path: "$lapangan", preserveNullAndEmpty: true } },
      {
        $addFields: {
          nama_lapangan: "$lapangan.nama_lapangan",
        },
      },
      { $project: { lapangan: 0 } },
    ])
    .toArray();
  return result;
}

// ---------------------------------------------------------------------------
// Payment Operations
// ---------------------------------------------------------------------------

export async function createPayment(data: any) {
  const col = await getCollection("pembayaran");
  const result = await col.insertOne({
    id_order: toObjectId(data.id_order),
    metode_pembayaran: data.metode_pembayaran,
    tanggal_bayar: data.tanggal_bayar,
    status_pembayaran: data.status_pembayaran || "pending",
    jumlah_bayar: data.jumlah_bayar,
    bukti_pembayaran: data.bukti_pembayaran,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return result;
}

export async function getPaymentByOrder(id_order: string) {
  const col = await getCollection("pembayaran");
  return col.findOne({ id_order: toObjectId(id_order) });
}

// ---------------------------------------------------------------------------
// Review Operations
// ---------------------------------------------------------------------------

export async function createReview(data: any) {
  const col = await getCollection("review");
  const result = await col.insertOne({
    id_pelanggan: toObjectId(data.id_pelanggan),
    id_mitra: toObjectId(data.id_mitra),
    rating: data.rating,
    komentar: data.komentar,
    tanggal_review: data.tanggal_review,
    created_at: new Date(),
  });
  return result;
}

export async function getReviewsByMitra(id_mitra: string) {
  const col = await getCollection("review");
  return col.find({ id_mitra: toObjectId(id_mitra) }).toArray();
}

// ---------------------------------------------------------------------------
// Customer Service Operations
// ---------------------------------------------------------------------------

export async function createCustomerService(data: any) {
  const col = await getCollection("customer_service");
  const result = await col.insertOne({
    id_pelanggan: data.id_pelanggan ? toObjectId(data.id_pelanggan) : null,
    id_mitra: data.id_mitra ? toObjectId(data.id_mitra) : null,
    pesan: data.pesan,
    tanggal: data.tanggal,
    status_keluhan: data.status_keluhan || "open",
    created_at: new Date(),
  });
  return result;
}

// ---------------------------------------------------------------------------
// Broadcast Operations
// ---------------------------------------------------------------------------

export async function createBroadcast(data: any) {
  const col = await getCollection("broadcast");
  const result = await col.insertOne({
    id_admin: toObjectId(data.id_admin),
    judul: data.judul,
    isi: data.isi,
    tanggal_kirim: data.tanggal_kirim,
    tipe_penerima: data.tipe_penerima || "all",
    created_at: new Date(),
  });
  return result;
}
