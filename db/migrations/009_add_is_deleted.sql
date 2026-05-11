-- Migration 009: Add soft-delete flag to venues
ALTER TABLE venues
  ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0 AFTER hours;

-- Ensure existing rows have default 0
UPDATE venues SET is_deleted = 0 WHERE is_deleted IS NULL;
