#!/usr/bin/env node
// Seed MongoDB with sample data for bookinginlapangan
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function loadEnvLocal() {
  const out = {};
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (!fs.existsSync(envPath)) return out;
    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      out[key] = value;
    }
  } catch (_) {}
  return out;
}

function getMongoConfig() {
  const env = loadEnvLocal();
  return {
    uri: process.env.MONGODB_URI || env.MONGODB_URI || 'mongodb://localhost:27017',
    database: process.env.MONGODB_DATABASE || env.MONGODB_DATABASE || 'bookinginlapangan',
  };
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.pbkdf2Sync(String(password), salt, 120000, 64, 'sha512').toString('hex');
  return `${salt}:${derived}`;
}

async function run() {
  const { uri, database } = getMongoConfig();
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(`Connected to MongoDB. Seeding database: ${database}`);
    const db = client.db(database);

    // -----------------------------------------------------------------------
    // Admin seed
    // -----------------------------------------------------------------------
    const adminCol = db.collection('admin');
    const adminExists = await adminCol.findOne({ email: 'admin@bookinginlapangan.com' });
    if (!adminExists) {
      await adminCol.insertOne({
        nama: 'Super Admin',
        email: 'admin@bookinginlapangan.com',
        password: hashPassword('admin123'),
        no_hp: '081234567890',
        created_at: new Date(),
        updated_at: new Date(),
      });
      console.log('- seeded: admin');
    } else {
      console.log('- skip: admin already exists');
    }

    // -----------------------------------------------------------------------
    // Mitra seed
    // -----------------------------------------------------------------------
    const mitraCol = db.collection('mitra');
    const mitraExists = await mitraCol.findOne({ email: 'mitra@example.com' });
    let mitraId;
    if (!mitraExists) {
      const res = await mitraCol.insertOne({
        nama_mitra: 'Mitra Lapangan Sejahtera',
        alamat: 'Jl. Olahraga No. 1, Jakarta',
        no_hp: '082345678901',
        email: 'mitra@example.com',
        password: hashPassword('mitra123'),
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      });
      mitraId = res.insertedId;
      console.log('- seeded: mitra');
    } else {
      mitraId = mitraExists._id;
      console.log('- skip: mitra already exists');
    }

    // -----------------------------------------------------------------------
    // Pelanggan seed
    // -----------------------------------------------------------------------
    const pelangganCol = db.collection('pelanggan');
    const pelangganExists = await pelangganCol.findOne({ email: 'pelanggan@example.com' });
    if (!pelangganExists) {
      await pelangganCol.insertOne({
        nama: 'Budi Santoso',
        email: 'pelanggan@example.com',
        password: hashPassword('pelanggan123'),
        no_hp: '083456789012',
        alamat: 'Jl. Mawar No. 5, Jakarta',
        created_at: new Date(),
        updated_at: new Date(),
      });
      console.log('- seeded: pelanggan');
    } else {
      console.log('- skip: pelanggan already exists');
    }

    // -----------------------------------------------------------------------
    // Lapangan seed
    // -----------------------------------------------------------------------
    const lapanganCol = db.collection('lapangan');
    const lapanganExists = await lapanganCol.findOne({ nama_lapangan: 'Lapangan Futsal A' });
    if (!lapanganExists) {
      await lapanganCol.insertMany([
        {
          id_mitra: mitraId,
          nama_lapangan: 'Lapangan Futsal A',
          jenis_olahraga: 'Futsal',
          lokasi: 'Lantai 1',
          harga: 150000,
          status_ketersediaan: 'available',
          deskripsi: 'Lapangan futsal sintetis ukuran standar dengan pencahayaan LED.',
          foto: '/images/field1.svg',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id_mitra: mitraId,
          nama_lapangan: 'Lapangan Badminton B',
          jenis_olahraga: 'Badminton',
          lokasi: 'Lantai 2',
          harga: 80000,
          status_ketersediaan: 'available',
          deskripsi: 'Lapangan badminton indoor dengan lantai kayu.',
          foto: '/images/field2.svg',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
      console.log('- seeded: lapangan (2 records)');
    } else {
      console.log('- skip: lapangan already exists');
    }

    // -----------------------------------------------------------------------
    // Venues seed (for the new booking system)
    // -----------------------------------------------------------------------
    const venuesCol = db.collection('venues');
    const venueExists = await venuesCol.findOne({ name: 'Lapangan A' });
    if (!venueExists) {
      await venuesCol.insertMany([
        {
          name: 'Lapangan A',
          image: '/images/field1.svg',
          price: 150000,
          location: 'Jakarta Utara',
          description: 'Lapangan sintetis ukuran standar.',
          facilities: ['Pencahayaan', 'Kamar Mandi'],
          size: '40x20',
          surface_type: 'Sintetis',
          hours: '06:00 - 22:00',
          details: { size: '40x20', type: 'Sintetis' },
          is_deleted: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Lapangan B',
          image: '/images/field2.svg',
          price: 120000,
          location: 'Jakarta Selatan',
          description: 'Lapangan futsal nyaman dengan tribun.',
          facilities: ['Tribun', 'Parkir'],
          size: '30x15',
          surface_type: 'Sintetis',
          hours: '07:00 - 21:00',
          details: { size: '30x15', type: 'Sintetis' },
          is_deleted: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Lapangan C',
          image: '/images/field3.svg',
          price: 100000,
          location: 'Depok',
          description: 'Lapangan rumput alami.',
          facilities: ['Rumput Alami', 'Ruang Ganti'],
          size: '45x25',
          surface_type: 'Alami',
          hours: '06:00 - 20:00',
          details: { size: '45x25', type: 'Alami' },
          is_deleted: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
      console.log('- seeded: venues (3 records)');
    } else {
      console.log('- skip: venues already exists');
    }

    // -----------------------------------------------------------------------
    // Users seed (for the new auth system)
    // -----------------------------------------------------------------------
    const usersCol = db.collection('users');
    const userExists = await usersCol.findOne({ email: 'user@example.com' });
    if (!userExists) {
      await usersCol.insertOne({
        name: 'Demo User',
        email: 'user@example.com',
        password_hash: hashPassword('user123456'),
        created_at: new Date(),
        updated_at: new Date(),
      });
      console.log('- seeded: users');
    } else {
      console.log('- skip: users already exists');
    }

    console.log('\nSeed completed successfully.');
    console.log('\nDefault credentials:');
    console.log('  Admin    : admin@bookinginlapangan.com / admin123');
    console.log('  Mitra    : mitra@example.com / mitra123');
    console.log('  Pelanggan: pelanggan@example.com / pelanggan123');
    console.log('  User     : user@example.com / user123456');
  } catch (err) {
    console.error('Seed failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
