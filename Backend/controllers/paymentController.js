/**
 * Payment Controller - Business logic for payments
 */

const paychanguService = require('../services/paychanguService');
const supabase = require('../config/supabase');

const paymentController = {
  /**
   * Health check for payment API
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async healthCheck(req, res) {
    try {
      const result = await paychanguService.healthCheck();
      res.json({
        message: 'PAYCHANGU API 🇲🇼✅',
        error: false,
        data: result,
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({
        error: true,
        message: error.response?.data || error.message,
      });
    }
  },

  /**
   * Initiate a payment transaction
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async initiateTransaction(req, res) {
    try {
      const {
        amount,
        tx_ref,
        first_name,
        last_name,
        email,
        callback_url,
        return_url,
      } = req.body;

      if (!tx_ref || !amount) {
        return res.status(400).json({
          error: true,
          message: 'tx_ref and amount are required',
        });
      }

      const result = await paychanguService.initiateTransaction({
        amount,
        tx_ref,
        first_name,
        last_name,
        email,
        callback_url,
        return_url,
      });

      res.status(200).json({
        error: false,
        data: result,
      });
    } catch (error) {
      console.error('Payment error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to initiate payment. Please check your API credentials.';
      res.status(500).json({
        error: true,
        message: errorMessage,
      });
    }
  },

  /**
   * Verify a payment transaction
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async verifyPayment(req, res) {
    try {
      const { tx_ref } = req.params;

      if (!tx_ref) {
        return res.status(400).json({
          error: true,
          message: 'tx_ref is required',
        });
      }

      const result = await paychanguService.verifyPayment(tx_ref);

      res.status(200).json({
        error: false,
        data: result,
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({
        error: true,
        message: error.response?.data || error.message,
      });
    }
  },

  /**
   * Get available mobile money providers
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMobileMoney(req, res) {
    try {
      const result = await paychanguService.getMobileMoneyProviders();

      res.status(200).json({
        error: false,
        data: result,
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({
        error: true,
        message: error.response?.data || error.message,
      });
    }
  },

  /**
   * Initialize bank transfer / direct charge
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bankTransfer(req, res) {
    try {
      const {
        amount,
        payment_method,
        charge_id,
        email,
        first_name,
        last_name,
        mobile,
      } = req.body;

      if (!amount || !payment_method || !charge_id || !mobile) {
        return res.status(400).json({
          error: true,
          message: 'amount, payment_method, charge_id and mobile are required',
        });
      }

      const result = await paychanguService.initializeBankTransfer({
        amount,
        payment_method,
        charge_id,
        email,
        first_name,
        last_name,
        mobile,
      });

      res.status(200).json({
        error: false,
        data: result,
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({
        error: true,
        message: error.response?.data || error.message,
      });
    }
  },

  /**
   * Handle Paychangu webhook callback for payment confirmation - PRODUCTION SECURE VERSION
   * Verifies payment with PayChangu API before updating booking
   * Prevents duplicates and deep destructuring crashes
   */
  async handleCallback(req, res) {
    try {
      const callbackData = req.body;
      console.log("Webhook received:", callbackData);

      const tx_ref = callbackData?.tx_ref;
      if (!tx_ref) {
        console.log("tx_ref missing");
        return res.sendStatus(200);
      }

      // Prevent duplicate processing
      const { data: booking, error: dbError } = await supabase
        .from('bookings')
        .select('status')
        .eq('tx_ref', tx_ref)
        .maybeSingle();

      if (dbError) {
        console.error("DB lookup error:", dbError.message);
      }
      if (booking && booking.status !== 'pending') {
        console.log(`tx_ref ${tx_ref} already processed (status: ${booking.status})`);
        return res.sendStatus(200);
      }

      // Verify with PayChangu API (security rule)
      const verification = await paychanguService.verifyPayment(tx_ref);
      
      if (verification?.data?.status === 'success') {
        console.log("Payment verified:", tx_ref);
        
        // Update booking status to confirmed
        if (booking) {
          const { error: updateError } = await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('tx_ref', tx_ref);
            
          if (updateError) {
            console.error("Failed to update booking:", updateError.message);
          } else {
            console.log(`Booking confirmed for tx_ref: ${tx_ref}`);
          }
        }
      } else {
        console.log(`Payment verification failed for tx_ref: ${tx_ref}`);
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("Webhook error:", error);
      res.sendStatus(200);
    }
  },

};

module.exports = paymentController;

