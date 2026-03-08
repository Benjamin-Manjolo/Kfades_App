const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');
const paychanguRouter = require('./Paychangu-with-axios/payment');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/paychangu', paychanguRouter);

// Welcome kurupt the barber
app.get('/', (req, res) => {
  res.send('Welcome to Kfades Booking API!')
});

// POST endpoint to save booking to Supabase
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = req.body;
    const timestamp = new Date().toISOString();

    // Insert booking into Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          booking_id: booking.id,
          service_name: booking.serviceName,
          price: booking.totalPrice,
          date: booking.date,
          time: booking.time,
          customer_name: booking.customerName,
          phone: booking.phone,
          address: booking.address,
          special_requests: booking.specialRequests || null,
          payment_option: booking.paymentOption,
          status: booking.status,
          created_at: timestamp,
        },
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ success: false, message: 'Error saving booking to database' });
    }

    console.log('Booking saved to Supabase:', booking.id);
    res.status(200).json({ success: true, message: 'Booking saved successfully', data });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ success: false, message: 'Error saving booking' });
  }
});

// GET endpoint to retrieve all bookings from Supabase
app.get('/api/bookings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ success: false, message: 'Error reading bookings' });
    }

    // Format the bookings for display
    const formattedBookings = data.map(booking => `
=== NEW BOOKING ===
Time: ${booking.created_at}
--------------------
Booking ID: ${booking.booking_id}
Service: ${booking.service_name}
Price: $${booking.price}
Date: ${booking.date}
Time: ${booking.time}
Customer Name: ${booking.customer_name}
Phone: ${booking.phone}
Address: ${booking.address}
Special Requests: ${booking.special_requests || 'None'}
Payment Option: ${booking.payment_option}
Status: ${booking.status}
====================
`).join('\n');

    res.status(200).json({ success: true, data: formattedBookings, rawData: data });
  } catch (error) {
    console.error('Error reading bookings:', error);
    res.status(500).json({ success: false, message: 'Error reading bookings' });
  }
});

// PUT endpoint to update booking status
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('booking_id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ success: false, message: 'Error updating booking' });
    }

    console.log('Booking updated:', id, 'Status:', status);
    res.status(200).json({ success: true, message: 'Booking updated successfully', data });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ success: false, message: 'Error updating booking' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
