const Incident = require('../models/Incident');

/**
 * Get all incidents with filters and pagination
 * Query params:
 *   - severity: filter by severity level
 *   - attackType: filter by attack type
 *   - status: filter by status
 *   - search: search by sourceIP
 *   - page: page number (default: 1)
 *   - limit: items per page (default: 10)
 */
const getAllIncidents = async (req, res) => {
  try {
    // Extract query parameters
    const { severity, attackType, status, search, page = 1, limit = 10 } = req.query;

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Max limit of 100

    // Build MongoDB filter query
    const filter = {};

    // Add filters if provided
    if (severity) {
      filter.severity = severity;
    }

    if (attackType) {
      filter.attackType = attackType;
    }

    if (status) {
      filter.status = status;
    }

    // Add search filter for sourceIP
    if (search) {
      filter.sourceIP = { $regex: search, $options: 'i' }; // Case-insensitive regex search
    }

    // Calculate skip for pagination
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination and sorting
    const incidents = await Incident.find(filter)
      .sort({ createdAt: -1 }) // Sort by timestamp descending (newest first)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination info
    const totalCount = await Incident.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limitNum);

    // Return success response
    res.status(200).json({
      success: true,
      data: incidents,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Error in getAllIncidents:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving incidents',
      error: error.message,
    });
  }
};

module.exports = {
  getAllIncidents,
};
