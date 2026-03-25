/**
 * Payment Routes - Route definitions for payments
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// GET  /paychangu                           - Health check
router.get('/', paymentController.healthCheck);

// POST /paychangu/initiate-transaction      - Initiate a payment
router.post('/initiate-transaction', paymentController.initiateTransaction);

// GET  /paychangu/verify-payment/:tx_ref   - Verify a payment
router.get('/verify-payment/:tx_ref', paymentController.verifyPayment);

// GET  /paychangu/mobile-money             - Get mobile money providers
router.get('/mobile-money', paymentController.getMobileMoney);

// POST /paychangu/bank-transfer            - Initialize bank transfer / direct charge
router.post('/bank-transfer', paymentController.bankTransfer);

// POST /paychangu/callback                 - Paychangu webhook callback
router.post('/callback', paymentController.handleCallback);

// NOTE: /mobile-payout is intentionally removed — mobile payouts are triggered
// automatically inside handleCallback and via PayoutController.manualPayout.
// Exposing a raw payout endpoint without auth would be a security risk.

module.exports = router;
