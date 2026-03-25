/**
 * Kfades Booking API - Server Entry Point
 * Restructured to MVC Architecture
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const payoutRoutes  = require('./routes/payoutRoutes'); // ← FIX: was missing

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Welcome endpoint
app.get('/', (req, res) => {
  res.send('Welcome to Kfades Booking API!');
});

// Mount routes
app.use('/api/bookings',      bookingRoutes);
app.use('/paychangu',         paymentRoutes);
app.use('/paychangu/payouts', payoutRoutes); // ← FIX: was never mounted

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
