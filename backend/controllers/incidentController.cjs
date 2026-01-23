const Incident = require('../models/Incident.cjs');

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

/**
 * Create new incident
 * Body params:
 *   - attackType: required
 *   - severity: required
 *   - sourceIP: required
 *   - targetSystem: required
 *   - description: optional
 *   - detectedBy: optional
 */
const createIncident = async (req, res) => {
  try {
    const { attackType, severity, sourceIP, targetSystem, description, detectedBy } = req.body;

    // Validate required fields
    if (!attackType || !severity || !sourceIP || !targetSystem) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: attackType, severity, sourceIP, targetSystem',
      });
    }

    // Create new incident
    const incident = new Incident({
      attackType,
      severity,
      sourceIP,
      targetSystem,
      description,
      detectedBy: detectedBy || 'Auto-Detection',
    });

    // Save to database
    await incident.save();

    // Return created incident
    res.status(201).json({
      success: true,
      message: 'Incident created successfully',
      data: incident,
    });
  } catch (error) {
    console.error('Error in createIncident:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating incident',
      error: error.message,
    });
  }
};

/**
 * Update incident by ID
 * Params:
 *   - id: incident ID
 * Body params: any incident fields to update
 */
const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find incident by ID and update
    const incident = await Incident.findByIdAndUpdate(id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Run schema validators
    });

    // Check if incident exists
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Return updated incident
    res.status(200).json({
      success: true,
      message: 'Incident updated successfully',
      data: incident,
    });
  } catch (error) {
    console.error('Error in updateIncident:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating incident',
      error: error.message,
    });
  }
};

/**
 * Mark incident as resolved
 * Params:
 *   - id: incident ID
 */
const markAsResolved = async (req, res) => {
  try {
    const { id } = req.params;

    // Find incident by ID and update status and resolvedAt
    const incident = await Incident.findByIdAndUpdate(
      id,
      {
        status: 'Resolved',
        resolvedAt: new Date(),
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    );

    // Check if incident exists
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Return updated incident
    res.status(200).json({
      success: true,
      message: 'Incident marked as resolved',
      data: incident,
    });
  } catch (error) {
    console.error('Error in markAsResolved:', error);
    res.status(400).json({
      success: false,
      message: 'Error resolving incident',
      error: error.message,
    });
  }
};

module.exports = {
  getAllIncidents,
  createIncident,
  updateIncident,
  markAsResolved,
};
