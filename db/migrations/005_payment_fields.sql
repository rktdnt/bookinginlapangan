ALTER TABLE bookings
  ADD COLUMN payment_method VARCHAR(20) NULL AFTER status,
  ADD COLUMN payment_proof_path VARCHAR(255) NULL AFTER payment_method,
  ADD COLUMN payment_proof_name VARCHAR(255) NULL AFTER payment_proof_path;