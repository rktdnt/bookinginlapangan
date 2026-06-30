#!/usr/bin/env node
// MongoDB index setup for bookinginlapangan
// Replaces the MySQL migration runner (init-db.js)
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

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

async function run() {
  const { uri, database } = getMongoConfig();
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(`Connected to MongoDB at ${uri}`);
    const db = client.db(database);
    console.log(`Using database: ${database}`);

    // -----------------------------------------------------------------------
    // users collection
    // -----------------------------------------------------------------------
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('- index: users.email (unique)');

    // -----------------------------------------------------------------------
    // sessions collection
    // -----------------------------------------------------------------------
    await db.collection('sessions').createIndex({ token_hash: 1 }, { unique: true });
    await db.collection('sessions').createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
    console.log('- index: sessions.token_hash (unique), sessions.expires_at (TTL)');

    // -----------------------------------------------------------------------
    // admin collection
    // -----------------------------------------------------------------------
    await db.collection('admin').createIndex({ email: 1 }, { unique: true });
    console.log('- index: admin.email (unique)');

    // -----------------------------------------------------------------------
    // mitra collection
    // -----------------------------------------------------------------------
    await db.collection('mitra').createIndex({ email: 1 }, { unique: true });
    console.log('- index: mitra.email (unique)');

    // -----------------------------------------------------------------------
    // pelanggan collection
    // -----------------------------------------------------------------------
    await db.collection('pelanggan').createIndex({ email: 1 }, { unique: true });
    console.log('- index: pelanggan.email (unique)');

    // -----------------------------------------------------------------------
    // lapangan collection
    // -----------------------------------------------------------------------
    await db.collection('lapangan').createIndex({ id_mitra: 1 });
    console.log('- index: lapangan.id_mitra');

    // -----------------------------------------------------------------------
    // venues collection
    // -----------------------------------------------------------------------
    await db.collection('venues').createIndex({ name: 1 });
    await db.collection('venues').createIndex({ is_deleted: 1 });
    console.log('- index: venues.name, venues.is_deleted');

    // -----------------------------------------------------------------------
    // bookings collection
    // -----------------------------------------------------------------------
    await db.collection('bookings').createIndex({ user_id: 1 });
    await db.collection('bookings').createIndex({ venue_id: 1 });
    await db.collection('bookings').createIndex({ status: 1 });
    console.log('- index: bookings.user_id, bookings.venue_id, bookings.status');

    // -----------------------------------------------------------------------
    // orders collection
    // -----------------------------------------------------------------------
    await db.collection('orders').createIndex({ id_pelanggan: 1 });
    await db.collection('orders').createIndex({ id_lapangan: 1 });
    await db.collection('orders').createIndex({ status_order: 1 });
    console.log('- index: orders.id_pelanggan, orders.id_lapangan, orders.status_order');

    // -----------------------------------------------------------------------
    // pembayaran collection
    // -----------------------------------------------------------------------
    await db.collection('pembayaran').createIndex({ id_order: 1 }, { unique: true });
    console.log('- index: pembayaran.id_order (unique)');

    // -----------------------------------------------------------------------
    // review collection
    // -----------------------------------------------------------------------
    await db.collection('review').createIndex({ id_pelanggan: 1 });
    await db.collection('review').createIndex({ id_mitra: 1 });
    console.log('- index: review.id_pelanggan, review.id_mitra');

    // -----------------------------------------------------------------------
    // broadcast collection
    // -----------------------------------------------------------------------
    await db.collection('broadcast').createIndex({ id_admin: 1 });
    console.log('- index: broadcast.id_admin');

    // -----------------------------------------------------------------------
    // customer_service collection
    // -----------------------------------------------------------------------
    await db.collection('customer_service').createIndex({ id_pelanggan: 1 });
    await db.collection('customer_service').createIndex({ id_mitra: 1 });
    await db.collection('customer_service').createIndex({ status_keluhan: 1 });
    console.log('- index: customer_service.id_pelanggan, .id_mitra, .status_keluhan');

    // -----------------------------------------------------------------------
    // riwayat collection
    // -----------------------------------------------------------------------
    await db.collection('riwayat').createIndex({ id_order: 1 }, { unique: true });
    console.log('- index: riwayat.id_order (unique)');

    console.log('\nMongoDB indexes created successfully.');
  } catch (err) {
    console.error('Index setup failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
