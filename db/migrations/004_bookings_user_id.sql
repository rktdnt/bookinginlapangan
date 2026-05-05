-- Add user_id to bookings so bookings can be associated with a user
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS user_id BIGINT NULL;

-- Drop existing foreign key if it exists (MariaDB doesn't support ADD CONSTRAINT IF NOT EXISTS)
SET @constraint_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
  WHERE TABLE_NAME='bookings' AND COLUMN_NAME='user_id' AND REFERENCED_TABLE_NAME='users'
);

SET @sql := IF(@constraint_exists = 0,
  'ALTER TABLE bookings ADD CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
