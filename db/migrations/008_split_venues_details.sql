-- Migration 008: Split venues.details JSON into separate columns
ALTER TABLE venues
  ADD COLUMN size VARCHAR(100) DEFAULT '' AFTER description,
  ADD COLUMN surface_type VARCHAR(100) DEFAULT '' AFTER size,
  ADD COLUMN hours VARCHAR(100) DEFAULT '' AFTER surface_type;

-- If `details` JSON exists, migrate common keys into new columns
-- This uses MySQL JSON_EXTRACT; it will set empty string if not present.
UPDATE venues
SET
  size = COALESCE(JSON_UNQUOTE(JSON_EXTRACT(details, '$.size')), ''),
  surface_type = COALESCE(JSON_UNQUOTE(JSON_EXTRACT(details, '$.type')), ''),
  hours = COALESCE(JSON_UNQUOTE(JSON_EXTRACT(details, '$.hours')), '')
WHERE details IS NOT NULL AND details <> '';

-- Note: we keep the existing `details` column for backward compatibility.
