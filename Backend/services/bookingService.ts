/**
 * Booking Service - API calls for bookings
 */

import { Booking } from '../types';

// FIX: was 'http://localhost:3001/api' — broke all service calls in production
const API_BASE_URL = 'https://kfades.onrender.com/api';

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
  tx_ref?: string;
}

export interface BookingApiResponse {
  success: boolean;
  message: string;
  data?: any;
  rawData?: any[];
}

const bookingService = {
  async createBooking(bookingData: CreateBookingData): Promise<BookingApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error creating booking',
      };
    }
  },

  async getAllBookings(): Promise<BookingApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error fetching bookings',
      };
    }
  },

  async getBookingById(id: string): Promise<BookingApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching booking:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error fetching booking',
      };
    }
  },

  async updateBookingStatus(id: string, status: string): Promise<BookingApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating booking:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error updating booking',
      };
    }
  },

  async deleteBooking(id: string): Promise<BookingApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
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
