/**
 * Payout Routes - Route definitions for payout history and manual payouts
 */

const express = require('express');
const router = express.Router();
const payoutController = require('../controllers/PayoutController');

// GET /paychangu/payouts - Get all payout records
router.get('/', payoutController.getAllPayouts);

// GET /paychangu/payouts/stats - Get payout summary stats
router.get('/stats', payoutController.getPayoutStats);

// POST /paychangu/payouts/manual - Manually trigger a payout
router.post('/manual', payoutController.manualPayout);

module.exports = router;