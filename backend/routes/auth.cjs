const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController.cjs');

// POST /api/auth/register - Register new user
router.post('/register', register);

// POST /api/auth/login - Login user
router.post('/login', login);

// GET /api/auth/logout - Logout user
router.get('/logout', (req, res) => {
  try {
    // TODO: Invalidate token if needed
    // TODO: Clear session/cookies if applicable

    res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/me - Get current user (protected)
router.get('/me', (req, res) => {
  try {
    // TODO: Verify JWT token
    // TODO: Get user from database

    res.status(200).json({
      message: 'Current user retrieved',
      user: {
        id: 'user_id',
        username: 'username',
        email: 'user@example.com',
        role: 'analyst',
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
