-- Migration: Add tx_ref to existing bookings table (PayChangu webhook integration)
-- Run this in Supabase SQL Editor

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS tx_ref VARCHAR(255);

ALTER TABLE bookings 
ADD CONSTRAINT unique_tx_ref UNIQUE (tx_ref);

-- Create index for faster webhook lookups
CREATE INDEX IF NOT EXISTS idx_bookings_tx_ref ON bookings(tx_ref);

-- Optional: Update existing pending bookings if needed (manual)
-- UPDATE bookings SET tx_ref = 'manual_' || booking_id WHERE tx_ref IS NULL AND status = 'pending';

