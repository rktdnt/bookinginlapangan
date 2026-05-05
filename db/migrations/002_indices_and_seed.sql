-- Create useful indexes and add additional seed venues

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_venues_location ON venues(location);
CREATE INDEX IF NOT EXISTS idx_bookings_venue_id ON bookings(venue_id);

-- Additional seed venues
INSERT INTO venues (id, name, image, price, location, description)
VALUES ('4','Lapangan D','/images/field4.svg',90000,'Bogor','Lapangan indoor dengan lantai kayu.')
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO venues (id, name, image, price, location, description)
VALUES ('5','Lapangan E','/images/field5.svg',110000,'Bekasi','Lapangan serbaguna, dekat parkir.')
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO venues (id, name, image, price, location, description)
VALUES ('6','Lapangan F','/images/field6.svg',130000,'Tangerang','Lapangan futsal premium, AC.')
ON DUPLICATE KEY UPDATE id = id;
