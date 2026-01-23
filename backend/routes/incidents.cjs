const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.cjs');
const Incident = require('../models/Incident.cjs');

/**
 * GET /api/incidents
 * Get all incidents with optional filters
 * Query params: attackType, severity, status, sourceIP
 */
router.get('/', protect, async (req, res) => {
  try {
    const { attackType, severity, status, sourceIP } = req.query;
    
    // Build filter object
    const filter = {};
    if (attackType) filter.attackType = attackType;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (sourceIP) filter.sourceIP = sourceIP;

    const incidents = await Incident.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving incidents',
      error: error.message,
    });
  }
});

/**
 * GET /api/incidents/:id
 * Get single incident by ID
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving incident',
      error: error.message,
    });
  }
});

/**
 * POST /api/incidents
 * Create new incident
 */
router.post('/', protect, async (req, res) => {
  try {
    const { attackType, severity, sourceIP, targetSystem, description, detectedBy } = req.body;

    // Validation
    if (!attackType || !severity || !sourceIP || !targetSystem) {
      return res.status(400).json({
        success: false,
        message: 'attackType, severity, sourceIP, and targetSystem are required',
      });
    }

    const incident = new Incident({
      attackType,
      severity,
      sourceIP,
      targetSystem,
      description,
      detectedBy: detectedBy || 'Auto-Detection',
    });

    await incident.save();

    res.status(201).json({
      success: true,
      message: 'Incident created successfully',
      data: incident,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating incident',
      error: error.message,
    });
  }
});

/**
 * PUT /api/incidents/:id
 * Update incident
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const { attackType, severity, sourceIP, targetSystem, description, status, detectedBy } = req.body;

    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Update fields if provided
    if (attackType) incident.attackType = attackType;
    if (severity) incident.severity = severity;
    if (sourceIP) incident.sourceIP = sourceIP;
    if (targetSystem) incident.targetSystem = targetSystem;
    if (description !== undefined) incident.description = description;
    if (status) incident.status = status;
    if (detectedBy) incident.detectedBy = detectedBy;

    await incident.save();

    res.status(200).json({
      success: true,
      message: 'Incident updated successfully',
      data: incident,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating incident',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/incidents/:id
 * Delete incident
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Incident deleted successfully',
      data: incident,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting incident',
      error: error.message,
    });
  }
});

/**
 * PATCH /api/incidents/:id/resolve
 * Mark incident as resolved
 */
router.patch('/:id/resolve', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    incident.status = 'Resolved';
    incident.resolvedAt = new Date();

    await incident.save();

    res.status(200).json({
      success: true,
      message: 'Incident marked as resolved',
      data: incident,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error resolving incident',
      error: error.message,
    });
  }
});

module.exports = router;
