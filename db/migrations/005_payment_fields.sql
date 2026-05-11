-- Add payment-related fields to bookings table
-- Using IF NOT EXISTS to make migration idempotent (safe to re-run)

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) NULL AFTER status;

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS payment_proof_path VARCHAR(255) NULL AFTER payment_method;

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS payment_proof_name VARCHAR(255) NULL AFTER payment_proof_path;
