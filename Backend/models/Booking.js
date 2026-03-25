/**
 * Booking Model - Schema validation and data transformation
 */

class BookingModel {
  /**
   * Validate booking data before insertion
   */
  static validate(booking) {
    const requiredFields = [
      'id',
      'serviceName',
      'date',
      'time',
      'customerName',
      'phone',
      'address',
      'paymentOption',
      'status',
      'totalPrice',
    ];

    const errors = [];

    for (const field of requiredFields) {
      if (booking[field] === undefined || booking[field] === null || booking[field] === '') {
        errors.push(`Missing required field: ${field}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return true;
  }

  /**
   * Transform booking data for database insertion
   */
  static toDatabase(booking) {
    return {
      booking_id:       booking.id,
      service_name:     booking.serviceName,
      price:            booking.totalPrice,
      date:             booking.date,
      time:             booking.time,
      customer_name:    booking.customerName,
      phone:            booking.phone,
      address:          booking.address,
      special_requests: booking.specialRequests || null,
      payment_option:   booking.paymentOption,
      status:           booking.status,
      tx_ref:           booking.tx_ref || null, // populated when payment is initiated
      created_at:       new Date().toISOString(),
    };
  }

  /**
   * Transform database booking to API response format
   */
  static fromDatabase(dbBooking) {
    return {
      id:              dbBooking.booking_id,
      serviceName:     dbBooking.service_name,
      totalPrice:      dbBooking.price,
      date:            dbBooking.date,
      time:            dbBooking.time,
      customerName:    dbBooking.customer_name,
      phone:           dbBooking.phone,
      address:         dbBooking.address,
      specialRequests: dbBooking.special_requests,
      paymentOption:   dbBooking.payment_option,
      status:          dbBooking.status,
      tx_ref:          dbBooking.tx_ref,
      createdAt:       dbBooking.created_at,
    };
  }

  /**
   * Format booking for display
   * FIX: was using '$' — app uses MWK
   */
  static formatForDisplay(booking) {
    return `
=== NEW BOOKING ===
Time: ${booking.created_at}
--------------------
Booking ID: ${booking.booking_id}
Service:    ${booking.service_name}
Price:      MWK ${booking.price}
Date:       ${booking.date}
Time:       ${booking.time}
Customer:   ${booking.customer_name}
Phone:      ${booking.phone}
Address:    ${booking.address}
Requests:   ${booking.special_requests || 'None'}
Payment:    ${booking.payment_option}
Status:     ${booking.status}
TX Ref:     ${booking.tx_ref || 'N/A'}
====================
`.trim();
  }

  /** Valid status values */
  static validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'];
}

module.exports = BookingModel;
