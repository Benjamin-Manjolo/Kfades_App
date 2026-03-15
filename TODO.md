# PayChangu Secure Webhook Implementation

## Steps:
- [x] 1. Create SQL migration to add `tx_ref` column to `bookings` table (Run Backend/migrations/001_add_tx_ref.sql in Supabase)
- [x] 2. Edit Backend/models/Booking.js: Add tx_ref validation/transform
- [x] 3. Edit Backend/controllers/bookingController.js: Store tx_ref in createBooking (Model now handles)
- [x] 4. Edit Backend/controllers/paymentController.js: Implement secure handleCallback (verify + DB update)
- [ ] 5. Test webhook endpoint and DB integration

**Note:** Run migrations manually in Supabase SQL editor, then restart server after code edits.

