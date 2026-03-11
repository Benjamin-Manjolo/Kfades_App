/**
 * Booking Service - API calls for bookings
 */

import { Booking } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export interface CreateBookingData {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  customerName: string;
  phone: string;
  address: string;
  specialRequests?: string;
  paymentOption: 'deposit' | 'full' | 'cash';
  status: string;
  totalPrice: number;
}

export interface BookingApiResponse {
  success: boolean;
  message: string;
  data?: any;
  rawData?: any[];
}

const bookingService = {
  /**
   * Create a new booking
   * @param bookingData - Booking details
   * @returns Promise with API response
   */
  async createBooking(bookingData: CreateBookingData): Promise<BookingApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error creating booking',
      };
    }
  },

  /**
   * Get all bookings
   * @returns Promise with all bookings
   */
  async getAllBookings(): Promise<BookingApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error fetching bookings',
      };
    }
  },

  /**
   * Get a single booking by ID
   * @param id - Booking ID
   * @returns Promise with booking data
   */
  async getBookingById(id: string): Promise<BookingApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error fetching booking',
      };
    }
  },

  /**
   * Update booking status
   * @param id - Booking ID
   * @param status - New status
   * @returns Promise with update result
   */
  async updateBookingStatus(
    id: string,
    status: string
  ): Promise<BookingApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating booking:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error updating booking',
      };
    }
  },

  /**
   * Delete a booking
   * @param id - Booking ID
   * @returns Promise with delete result
   */
  async deleteBooking(id: string): Promise<BookingApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting booking:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error deleting booking',
      };
    }
  },
};

export default bookingService;

