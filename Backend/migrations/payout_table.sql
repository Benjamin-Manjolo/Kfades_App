-- ─── Payouts table ───────────────────────────────────────────────────────────
-- Run this in your Supabase SQL editor

create table if not exists payouts (
  id               uuid primary key default gen_random_uuid(),
  tx_ref           text not null,           -- original booking tx_ref
  charge_id        text not null unique,    -- payout-specific charge ID (PAYOUT_TX_...)
  amount           numeric(10, 2) not null,
  status           text not null default 'pending', -- pending | success | failed
  mobile           text,                    -- barber mobile number
  payout_response  text,                    -- raw JSON from Paychangu
  error_message    text,                    -- if payout failed
  note             text,                    -- manual payout notes
  created_at       timestamptz not null default now()
);

-- Index for fast lookups by booking reference
create index if not exists payouts_tx_ref_idx on payouts (tx_ref);
create index if not exists payouts_charge_id_idx on payouts (charge_id);
create index if not exists payouts_status_idx on payouts (status);

-- Optional: also add tx_ref column to bookings table if not already present
-- (used by handleCallback to look up the booking)
alter table bookings add column if not exists tx_ref text;
create index if not exists bookings_tx_ref_idx on bookings (tx_ref);