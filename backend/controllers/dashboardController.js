const Incident = require('../models/Incident');

/**
 * Get dashboard statistics
 * Calculates various metrics about incidents
 */
const getStats = async (req, res) => {
  try {
    // 1. Calculate total incidents count
    const totalIncidents = await Incident.countDocuments();

    // 2. Count by severity using MongoDB aggregation
    const severityStats = await Incident.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Format severity stats
    const severityBreakdown = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    };
    severityStats.forEach((stat) => {
      if (stat._id) {
        severityBreakdown[stat._id] = stat.count;
      }
    });

    // 3. Count by attack type using aggregation
    const attackTypeStats = await Incident.aggregate([
      {
        $group: {
          _id: '$attackType',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Format attack type stats
    const attackTypeBreakdown = {};
    attackTypeStats.forEach((stat) => {
      if (stat._id) {
        attackTypeBreakdown[stat._id] = stat.count;
      }
    });

    // 4. Count active vs resolved
    const statusStats = await Incident.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusBreakdown = {
      Active: 0,
      Investigating: 0,
      Resolved: 0,
    };
    statusStats.forEach((stat) => {
      if (stat._id) {
        statusBreakdown[stat._id] = stat.count;
      }
    });

    // 5. Count incidents in last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const incidentsLast24Hours = await Incident.countDocuments({
      createdAt: { $gte: last24Hours },
    });

    // 6. Get top 5 attacking IPs with count
    const topAttackingIPs = await Incident.aggregate([
      {
        $group: {
          _id: '$sourceIP',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    // Format top IPs
    const topIPsFormatted = topAttackingIPs.map((ip) => ({
      sourceIP: ip._id,
      count: ip.count,
    }));

    // 7. Calculate average resolution time in hours
    const resolutionTimeStats = await Incident.aggregate([
      {
        $match: {
          resolvedAt: { $exists: true, $ne: null },
        },
      },
      {
        $project: {
          resolutionTimeMs: {
            $subtract: ['$resolvedAt', '$createdAt'],
          },
        },
      },
      {
        $group: {
          _id: null,
          averageMs: { $avg: '$resolutionTimeMs' },
        },
      },
    ]);

    // Convert milliseconds to hours (or 0 if no resolved incidents)
    const averageResolutionTimeHours =
      resolutionTimeStats.length > 0 && resolutionTimeStats[0].averageMs
        ? Math.round((resolutionTimeStats[0].averageMs / (1000 * 60 * 60)) * 100) / 100
        : 0;

    // Return all stats
    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncidents,
          incidentsLast24Hours,
          averageResolutionTimeHours,
        },
        severityBreakdown,
        attackTypeBreakdown,
        statusBreakdown,
        topAttackingIPs: topIPsFormatted,
      },
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getStats,
};
