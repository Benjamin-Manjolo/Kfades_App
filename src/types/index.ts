export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description: string;
  image?: string;
  popular?: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  date: string; // ISO date string
  time: string; // HH:MM format
  customerName: string;
  phone: string;
  address: string;
  specialRequests?: string;
  paymentOption: 'deposit' | 'full' | 'cash';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  travelFee?: number;
  totalPrice: number;
}

export interface TimeSlot {
  time: string; // HH:MM format
  available: boolean;
}

export interface WorkingHours {
  day: string; // e.g., 'monday'
  start: string; // HH:MM
  end: string; // HH:MM
  buffers: number; // minutes before/after bookings
}

export interface TravelZone {
  name: string;
  distance: number; // km
  fee: number;
}

export interface AdminUser {
  phone: string;
  pin: string;
}
