const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    incidentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    attackType: {
      type: String,
      enum: ['DDoS', 'Phishing', 'Malware', 'SQLInjection', 'XSS'],
      required: [true, 'Attack type is required'],
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: [true, 'Severity level is required'],
    },
    sourceIP: {
      type: String,
      required: [true, 'Source IP is required'],
      validate: {
        validator: function (value) {
          // IPv4 and IPv6 regex validation
          const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
          const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
          return ipv4Regex.test(value) || ipv6Regex.test(value);
        },
        message: 'Please provide a valid IP address (IPv4 or IPv6)',
      },
    },
    targetSystem: {
      type: String,
      required: [true, 'Target system is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Investigating', 'Resolved'],
      default: 'Active',
    },
    detectedBy: {
      type: String,
      default: 'Auto-Detection',
      trim: true,
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook to generate incidentId
 * Format: INC-XXXXXX (where X's are alphanumeric characters)
 */
incidentSchema.pre('save', async function (next) {
  // Only generate if incidentId doesn't exist
  if (!this.incidentId) {
    try {
      let incidentId;
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10;

      // Generate unique incidentId
      while (!isUnique && attempts < maxAttempts) {
        // Generate random 6-character string (uppercase letters and digits)
        const randomStr = Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase()
          .padEnd(6, 'X');

        incidentId = `INC-${randomStr}`;

        // Check if this incidentId already exists
        const existingIncident = await mongoose.model('Incident').findOne({
          incidentId,
        });

        if (!existingIncident) {
          isUnique = true;
        }

        attempts++;
      }

      if (!isUnique) {
        throw new Error('Failed to generate unique incident ID');
      }

      this.incidentId = incidentId;
    } catch (error) {
      throw new Error(`Error generating incident ID: ${error.message}`);
    }
  }

  next();
});

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;
