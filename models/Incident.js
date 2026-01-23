const mongoose = require('mongoose');

/**
 * Incident Schema for MongoDB
 * Stores all security incident data
 */
const incidentSchema = new mongoose.Schema(
  {
    incidentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    attackType: {
      type: String,
      required: true,
      enum: ['DDoS', 'Phishing', 'Malware', 'SQLInjection', 'XSS'],
    },
    sourceIP: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Critical'],
    },
    status: {
      type: String,
      default: 'Open',
      enum: ['Open', 'Investigating', 'Resolved', 'Closed'],
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // DDoS specific fields
    targetURL: String,
    attackIntensity: Number,
    requestsPerSecond: Number,
    port: Number,
    duration: Number,

    // Phishing specific fields
    senderEmail: String,
    targetEmail: String,
    subject: String,
    phishingType: String,
    successRate: Number,

    // Malware specific fields
    malwareType: String,
    infectedFilePath: String,
    md5Hash: String,
    behaviorIndicators: [String],
    infectedSystemsCount: Number,

    // SQL Injection specific fields
    targetEndpoint: String,
    payload: String,
    vulnerabilityType: String,
    attackComplexity: String,
    success: Boolean,
    dataExposed: {
      usernamesExposed: Number,
      emailsExposed: Number,
      passwordsCount: Number,
    },

    // XSS specific fields
    xssType: String,
    impact: String,
    inputValidationBypassed: Boolean,

    // General fields
    notes: String,
    resolvedAt: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Create index on attackType and timestamp for efficient queries
incidentSchema.index({ attackType: 1, timestamp: -1 });
incidentSchema.index({ severity: 1 });

/**
 * Incident Model
 */
const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;
