/**
 * Booking Controller - Business logic for bookings
 */

const supabase = require('../config/supabase');
const BookingModel = require('../models/Booking');

const bookingController = {
  /**
   * Create a new booking
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createBooking(req, res) {
    try {
      const booking = req.body;

      // Validate booking data
      BookingModel.validate(booking);

      // Transform to database format
      const dbData = BookingModel.toDatabase(booking);

      // Insert into Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert([dbData]);

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Error saving booking to database' 
        });
      }

      console.log('Booking saved to Supabase:', booking.id);
      res.status(200).json({ 
        success: true, 
        message: 'Booking saved successfully', 
        data 
      });
    } catch (error) {
      console.error('Error saving booking:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Error saving booking' 
      });
    }
  },

  /**
   * Get all bookings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllBookings(req, res) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Error reading bookings' 
        });
      }

      // Format the bookings for display
      const formattedBookings = data
        .map(booking => BookingModel.formatForDisplay(booking))
        .join('\n');

      res.status(200).json({ 
        success: true, 
        data: formattedBookings, 
        rawData: data 
      });
    } catch (error) {
      console.error('Error reading bookings:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error reading bookings' 
      });
    }
  },

  /**
   * Get a single booking by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getBookingById(req, res) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(404).json({ 
          success: false, 
          message: 'Booking not found' 
        });
      }

      const formattedBooking = BookingModel.formatForDisplay(data);

      res.status(200).json({ 
        success: true, 
        data: formattedBooking, 
        rawData: data 
      });
    } catch (error) {
      console.error('Error reading booking:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error reading booking' 
      });
    }
  },

  /**
   * Update booking status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateBookingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      if (!BookingModel.validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Valid values: ${BookingModel.validStatuses.join(', ')}`
        });
      }

      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('booking_id', id);

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Error updating booking' 
        });
      }

      console.log('Booking updated:', id, 'Status:', status);
      res.status(200).json({ 
        success: true, 
        message: 'Booking updated successfully', 
        data 
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error updating booking' 
      });
    }
  },

  /**
   * Delete a booking
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteBooking(req, res) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('bookings')
        .delete()
        .eq('booking_id', id);

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Error deleting booking' 
        });
      }

      console.log('Booking deleted:', id);
      res.status(200).json({ 
        success: true, 
        message: 'Booking deleted successfully', 
        data 
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error deleting booking' 
      });
    }
  }
};

module.exports = bookingController;

