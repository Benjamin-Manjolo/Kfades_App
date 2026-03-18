-- Create bookings table in Supabase
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  service_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  special_requests TEXT,
  payment_option VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional, for security)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read/write access (adjust as needed)
CREATE POLICY "Allow public access to bookings" ON bookings
  FOR ALL
  USING (true)
  WITH CHECK (true);
