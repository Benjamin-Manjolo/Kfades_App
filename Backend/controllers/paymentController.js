/**
 * Payment Controller - Business logic for payments
 */

const paychanguService = require('../services/paychanguService');
const supabase = require('../config/supabase');

const paymentController = {
  /**
   * Health check for payment API
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
   */
  async initiateTransaction(req, res) {
    try {
      const { amount, tx_ref, first_name, last_name, email, callback_url, return_url } = req.body;

      if (!tx_ref || !amount) {
        return res.status(400).json({
          error: true,
          message: 'tx_ref and amount are required',
        });
      }

      const result = await paychanguService.initiateTransaction({
        amount, tx_ref, first_name, last_name, email, callback_url, return_url,
      });

      res.status(200).json({ error: false, data: result });
    } catch (error) {
      console.error('Payment error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message
        || error.message
        || 'Failed to initiate payment. Please check your API credentials.';
      res.status(500).json({ error: true, message: errorMessage });
    }
  },

  /**
   * Verify a payment transaction
   */
  async verifyPayment(req, res) {
    try {
      const { tx_ref } = req.params;
      if (!tx_ref) {
        return res.status(400).json({ error: true, message: 'tx_ref is required' });
      }
      const result = await paychanguService.verifyPayment(tx_ref);
      res.status(200).json({ error: false, data: result });
    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({ error: true, message: error.response?.data || error.message });
    }
  },

  /**
   * Get available mobile money providers
   */
  async getMobileMoney(req, res) {
    try {
      const result = await paychanguService.getMobileMoneyProviders();
      res.status(200).json({ error: false, data: result });
    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({ error: true, message: error.response?.data || error.message });
    }
  },

  /**
   * Initialize bank transfer / direct charge
   */
  async bankTransfer(req, res) {
    try {
      const { amount, payment_method, charge_id, email, first_name, last_name, mobile } = req.body;

      if (!amount || !payment_method || !charge_id || !mobile) {
        return res.status(400).json({
          error: true,
          message: 'amount, payment_method, charge_id and mobile are required',
        });
      }

      const result = await paychanguService.initializeBankTransfer({
        amount, payment_method, charge_id, email, first_name, last_name, mobile,
      });

      res.status(200).json({ error: false, data: result });
    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({ error: true, message: error.response?.data || error.message });
    }
  },

  /**
   * Handle Paychangu webhook callback
   * 1. Verify payment with PayChangu API
   * 2. Update booking status → confirmed
   * 3. Auto-trigger payout to barber
   * 4. Save payout record in Supabase
   */
  async handleCallback(req, res) {
  try {
    const callbackData = req.body;
    console.log("Webhook received:", JSON.stringify(callbackData, null, 2));

    const tx_ref = callbackData?.tx_ref;
    if (!tx_ref) {
      console.log("tx_ref missing from webhook — ignoring");
      return res.sendStatus(200);
    }

    // ── 1. Early rejection on webhook payload status ───────────────────────
    const webhookStatus = callbackData?.status;
    if (webhookStatus && webhookStatus !== 'success') {
      console.log(`Webhook status is '${webhookStatus}' for tx_ref: ${tx_ref} — ignoring`);
      return res.sendStatus(200);
    }

    // ── 2. Duplicate processing guard ─────────────────────────────────────
    const { data: booking, error: dbError } = await supabase
      .from('bookings')
      .select('status, price')
      .eq('tx_ref', tx_ref)
      .maybeSingle();

    if (dbError) console.error("DB lookup error:", dbError.message);

    if (booking && booking.status !== 'pending') {
      console.log(`tx_ref ${tx_ref} already processed (status: ${booking.status})`);
      return res.sendStatus(200);
    }

    // ── 3. Verify with PayChangu API ───────────────────────────────────────
    const verification = await paychanguService.verifyPayment(tx_ref);
    console.log("Verification response:", JSON.stringify(verification, null, 2));

    const verificationData = verification?.data;

    // Must be exactly 'success'
    if (verificationData?.status !== 'success') {
      console.log(`Verification status is '${verificationData?.status}' — not confirming`);
      return res.sendStatus(200);
    }

    // Currency must be MWK
    if (verificationData?.currency !== 'MWK') {
      console.error(`Currency mismatch: expected MWK, got ${verificationData?.currency}`);
      return res.sendStatus(200);
    }

    // Paid amount must be >= expected amount
    const expectedAmount = Number(booking?.price);
    const paidAmount     = Number(verificationData?.amount);

    if (expectedAmount && paidAmount < expectedAmount) {
      console.error(`Amount mismatch: expected ${expectedAmount}, got ${paidAmount}`);
      return res.sendStatus(200);
    }

    console.log(`Payment fully verified — tx_ref: ${tx_ref}, MWK ${paidAmount}`);

    // ── 4. Update booking → confirmed ─────────────────────────────────────
    if (booking) {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('tx_ref', tx_ref);

      if (updateError) console.error("Failed to update booking:", updateError.message);
      else console.log(`Booking confirmed for tx_ref: ${tx_ref}`);
    }

    // ── 5. Auto-trigger payout ─────────────────────────────────────────────
    const amount = expectedAmount || paidAmount;
    if (!amount) {
      console.error("Cannot determine payout amount — skipping");
      return res.sendStatus(200);
    }

    const payoutChargeId = `PAYOUT_${tx_ref}`;

    const { data: existingPayout } = await supabase
      .from('payouts').select('id').eq('charge_id', payoutChargeId).maybeSingle();

    if (existingPayout) {
      console.log(`Payout already recorded for ${payoutChargeId} — skipping`);
      return res.sendStatus(200);
    }

    let payoutStatus = 'failed', payoutResponse = null, payoutError = null;

    try {
      payoutResponse = await paychanguService.initiateMobilePayout({ amount, charge_id: payoutChargeId });
      payoutStatus   = payoutResponse?.data?.status || 'pending';
    } catch (payoutErr) {
      payoutError = payoutErr?.response?.data?.message || payoutErr?.message || 'Unknown payout error';
      console.error("Payout failed:", payoutError);
    }

    // ── 6. Save payout record ──────────────────────────────────────────────
    const { error: payoutInsertError } = await supabase
      .from('payouts')
      .insert([{
        tx_ref,
        charge_id:       payoutChargeId,
        amount,
        status:          payoutStatus,
        mobile:          process.env.BARBER_MOBILE || '0991234567',
        payout_response: payoutResponse ? JSON.stringify(payoutResponse) : null,
        error_message:   payoutError,
        created_at:      new Date().toISOString(),
      }]);

    if (payoutInsertError) console.error("Failed to save payout record:", payoutInsertError.message);
    else console.log(`Payout record saved — status: ${payoutStatus}`);

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(200);
  }
},

};

module.exports = paymentController;