-- Add facilities and details fields to venues

ALTER TABLE venues
  ADD COLUMN facilities JSON DEFAULT (JSON_ARRAY()),
  ADD COLUMN details JSON DEFAULT (JSON_OBJECT());

-- Optional: migrate existing description into details.description for older installs
UPDATE venues
SET details = JSON_OBJECT('description', COALESCE(description, ''))
WHERE details IS NULL OR JSON_LENGTH(details) = 0;
