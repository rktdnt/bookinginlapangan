-- Migration 010: Drop unused tables for DB optimization
-- Keep only: venues, bookings, users, sessions
-- Reason: Duplicates and no active API/UI integration

-- Drop dependent tables first (ones with FKs)
DROP TABLE IF EXISTS customer_service;
DROP TABLE IF EXISTS broadcast;
DROP TABLE IF EXISTS riwayat;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS pembayaran;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS lapangan;

-- Drop user-related duplicates
DROP TABLE IF EXISTS mitra;
DROP TABLE IF EXISTS pelanggan;
DROP TABLE IF EXISTS admin;
