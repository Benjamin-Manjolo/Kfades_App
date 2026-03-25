/**
 * Payout Controller - Business logic for payout history
 */

const supabase = require('../config/supabase');

const payoutController = {

  /**
   * GET /paychangu/payouts
   * Returns all payout records, newest first
   */
  async getAllPayouts(req, res) {
    try {
      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ success: false, message: 'Error fetching payouts' });
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error fetching payouts:', error);
      res.status(500).json({ success: false, message: 'Error fetching payouts' });
    }
  },

  /**
   * GET /paychangu/payouts/stats
   * Returns summary stats: total paid out, count, failed count
   */
  async getPayoutStats(req, res) {
    try {
      const { data, error } = await supabase
        .from('payouts')
        .select('amount, status');

      if (error) {
        return res.status(500).json({ success: false, message: 'Error fetching payout stats' });
      }

      const stats = data.reduce(
        (acc, row) => {
          acc.total++;
          if (row.status === 'pending' || row.status === 'success') {
            acc.totalAmount += Number(row.amount) || 0;
            acc.successCount++;
          } else {
            acc.failedCount++;
          }
          return acc;
        },
        { total: 0, totalAmount: 0, successCount: 0, failedCount: 0 }
      );

      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      console.error('Error fetching payout stats:', error);
      res.status(500).json({ success: false, message: 'Error fetching payout stats' });
    }
  },

  /**
   * POST /paychangu/payouts/manual
   * Manually trigger a payout (admin use)
   * Body: { amount, tx_ref, note }
   */
  async manualPayout(req, res) {
    try {
      const { amount, tx_ref, note } = req.body;

      if (!amount || !tx_ref) {
        return res.status(400).json({ success: false, message: 'amount and tx_ref are required' });
      }

      const paychanguService = require('../services/paychanguService');
      const chargeId = `MANUAL_${tx_ref}_${Date.now()}`;

      let payoutStatus = 'failed';
      let payoutResponse = null;
      let payoutError = null;

      try {
        payoutResponse = await paychanguService.initiateMobilePayout({
          amount,
          charge_id: chargeId,
        });
        payoutStatus = payoutResponse?.data?.status || 'pending';
      } catch (err) {
        payoutError = err?.response?.data?.message || err?.message || 'Payout failed';
      }

      // Save record
      const { error: insertError } = await supabase
        .from('payouts')
        .insert([{
          tx_ref,
          charge_id: chargeId,
          amount,
          status: payoutStatus,
          mobile: process.env.BARBER_MOBILE || '0991234567',
          payout_response: payoutResponse ? JSON.stringify(payoutResponse) : null,
          error_message: payoutError,
          note: note || 'Manual payout',
          created_at: new Date().toISOString(),
        }]);

      if (insertError) {
        console.error('Failed to save manual payout record:', insertError.message);
      }

      if (payoutError) {
        return res.status(500).json({ success: false, message: payoutError });
      }

      res.status(200).json({ success: true, message: 'Manual payout initiated', data: payoutResponse });
    } catch (error) {
      console.error('Manual payout error:', error);
      res.status(500).json({ success: false, message: 'Error processing manual payout' });
    }
  },

};

module.exports = payoutController;