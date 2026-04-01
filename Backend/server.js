/**
 * Kfades Booking API - Server Entry Point
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const payoutRoutes  = require('./routes/payoutRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to Kfades Booking API!');
});

app.use('/api/bookings', bookingRoutes);
app.use('/paychangu', paymentRoutes);
app.use('/paychangu/payouts', payoutRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});