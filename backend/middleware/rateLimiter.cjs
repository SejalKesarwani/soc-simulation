const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware for API routes
 * Limits requests to 100 per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  statusCode: 429, // Too Many Requests status code
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

module.exports = {
  apiLimiter,
};
