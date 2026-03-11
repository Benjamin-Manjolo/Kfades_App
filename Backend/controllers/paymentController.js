/**
 * Payment Controller - Business logic for payments
 */

const paychanguService = require('../services/paychanguService');

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
   * Handle Paychangu webhook callback for payment confirmation
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async handleCallback(req, res) {
    try {
      const callbackData = req.body;
      
      console.log('Payment callback received:', callbackData);

      // Extract relevant information from callback
      const { 
        tx_ref, 
        status, 
        amount, 
        customer: { email, first_name, last_name, phone } 
      } = callbackData;

      // Process the payment based on status
      if (status === 'successful' || status === 'completed') {
        // Payment was successful
        // Here you could:
        // - Update booking status in database
        // - Send confirmation email
        // - Update your own records
        
        console.log(`Payment successful for tx_ref: ${tx_ref}, amount: ${amount}`);
        
        // TODO: Add your booking/confirmation logic here
        // Example: Update booking payment status in Supabase
      } else if (status === 'failed' || status === 'cancelled') {
        console.log(`Payment failed/cancelled for tx_ref: ${tx_ref}`);
        // TODO: Handle failed payment
      }

      // Always respond with 200 to acknowledge receipt
      res.status(200).json({
        error: false,
        message: 'Callback received',
      });
    } catch (error) {
      console.error('Callback error:', error.message);
      // Still return 200 to prevent Paychangu from retrying
      res.status(200).json({
        error: false,
        message: 'Callback processed',
      });
    }
  },
};

module.exports = paymentController;

