/**
 * Booking Routes - Route definitions for bookings
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST /api/bookings - Create a new booking
router.post('/', bookingController.createBooking);

// GET /api/bookings - Get all bookings
router.get('/', bookingController.getAllBookings);

// GET /api/bookings/:id - Get a single booking by ID
router.get('/:id', bookingController.getBookingById);

// PUT /api/bookings/:id - Update booking status
router.put('/:id', bookingController.updateBookingStatus);

// DELETE /api/bookings/:id - Delete a booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;

