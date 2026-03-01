const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// File to store bookings
const BOOKINGS_FILE = path.join(__dirname, 'bookings.txt');

// Ensure bookings file exists
if (!fs.existsSync(BOOKINGS_FILE)) {
  fs.writeFileSync(BOOKINGS_FILE, '=== BOOKINGS RECORD ===\n\n');
}

// POST endpoint to save booking
app.post('/api/bookings', (req, res) => {
  try {
    const booking = req.body;
    const timestamp = new Date().toISOString();
    
    // Format booking data
    const bookingRecord = `
=== NEW BOOKING ===
Time: ${timestamp}
--------------------
Booking ID: ${booking.id}
Service: ${booking.serviceName || 'N/A'}
Price: $${booking.totalPrice || '0'}
Date: ${booking.date}
Time: ${booking.time}
Customer Name: ${booking.customerName}
Phone: ${booking.phone}
Address: ${booking.address}
Special Requests: ${booking.specialRequests || 'None'}
Payment Option: ${booking.paymentOption}
Status: ${booking.status}
====================

`;

    // Append to file
    fs.appendFileSync(BOOKINGS_FILE, bookingRecord);
    
    console.log('Booking saved:', booking.id);
    res.status(200).json({ success: true, message: 'Booking saved successfully' });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ success: false, message: 'Error saving booking' });
  }
});

// GET endpoint to retrieve all bookings
app.get('/api/bookings', (req, res) => {
  try {
    const bookings = fs.readFileSync(BOOKINGS_FILE, 'utf8');
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error reading bookings:', error);
    res.status(500).json({ success: false, message: 'Error reading bookings' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
