-- Initial schema for bookinglapangan

CREATE TABLE IF NOT EXISTS venues (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  price INTEGER,
  location VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  venue_id VARCHAR(50),
  customer_name VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_venue FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE SET NULL
);

-- Sample data (optional)
INSERT INTO venues (id, name, image, price, location, description)
VALUES ('1','Lapangan A','/images/field1.svg',150000,'Jakarta Utara','Lapangan sintetis ukuran standar.')
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO venues (id, name, image, price, location, description)
VALUES ('2','Lapangan B','/images/field2.svg',120000,'Jakarta Selatan','Lapangan futsal nyaman dengan tribun.')
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO venues (id, name, image, price, location, description)
VALUES ('3','Lapangan C','/images/field3.svg',100000,'Depok','Lapangan rumput alami.')
ON DUPLICATE KEY UPDATE id = id;
