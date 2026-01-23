const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.cjs');
const { getStats } = require('../controllers/dashboardController.cjs');

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics
 */
router.get('/stats', protect, getStats);

module.exports = router;
