-- Create bookings table in Supabase
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  bookingId VARCHAR(255) NOT NULL UNIQUE,
  serviceId VARCHAR(255) NOT NULL,
  time DECIMAL(10, 2) NOT NULL,
  customerName VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  specialReuests TEXT,
  paymentOption VARCHAR(50) NOT NULL,
   status VARCHAR(50) DEFAULT 'pending',
  totalPrice DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional, for security)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read/write access (adjust as needed)
CREATE POLICY "Allow public access to bookings" ON bookings
  FOR ALL
  USING (true)
  WITH CHECK (true);
