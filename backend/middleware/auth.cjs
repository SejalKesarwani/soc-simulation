const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');

/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens
 * Extracts user from token and attaches to req.user
 */
const protect = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please include a valid Bearer token in the Authorization header.',
      });
    }

    // Extract the token (remove 'Bearer ' prefix)
    const token = authHeader.slice(7);

    // Verify token using jwt.verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Decode userId from token
    const userId = decoded.id;

    // Find user in database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Token may be invalid or user has been deleted.',
      });
    }

    // Attach user to req.user
    req.user = user;

    // Call next() to proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please provide a valid authentication token.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: 'Authentication error: ' + error.message,
    });
  }
};

module.exports = { protect };
