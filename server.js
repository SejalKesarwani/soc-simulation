const express = require('express');
const { connectDB } = require('./config/database');
const attackStreamService = require('./services/attackStreamService');
const { calculateThreatLevel } = require('./utils/threatCalculator');
const { categorizeIncident } = require('./utils/incidentCategorizer');
const { generateAttackReport, exportToMarkdown } = require('./utils/reportGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

/**
 * Initialize the application
 */
async function initialize() {
  try {
    // Connect to MongoDB
    console.log('Connecting to database...');
    await connectDB();
    console.log('✓ Database connected\n');

    // Set up attack stream event listener
    console.log('Setting up attack stream listeners...');
    attackStreamService.on('newAttack', async (attack) => {
      try {
        // Calculate threat level
        const threatLevel = calculateThreatLevel(attack);

        // Categorize incident
        const categorized = categorizeIncident(attack);

        console.log(`\n📢 New Attack Detected:`);
        console.log(`   Incident ID: ${attack.incidentId}`);
        console.log(`   Type: ${attack.attackType}`);
        console.log(`   Severity: ${attack.severity}`);
        console.log(`   Threat Score: ${threatLevel.score}/100 (${threatLevel.severity})`);
        console.log(`   Source IP: ${attack.sourceIP}`);
        console.log(`   Categories: ${categorized.categories.join(', ')}`);
      } catch (error) {
        console.error('Error processing attack event:', error.message);
      }
    });

    console.log('✓ Attack stream listeners configured\n');

    // Start the attack stream with auto-start disabled (manual control)
    console.log('Starting attack simulation stream...');
    attackStreamService.start();

  } catch (error) {
    console.error('Initialization error:', error.message);
    process.exit(1);
  }
}

/**
 * API Routes
 */

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/stream/status
 * Get attack stream status
 */
app.get('/api/stream/status', (req, res) => {
  const stats = attackStreamService.getAttackStats();
  res.json({
    status: stats.isRunning ? 'running' : 'stopped',
    ...stats,
  });
});

/**
 * POST /api/stream/start
 * Start the attack stream
 */
app.post('/api/stream/start', (req, res) => {
  try {
    if (attackStreamService.getStatus()) {
      return res.status(400).json({ error: 'Attack stream is already running' });
    }

    attackStreamService.start();
    console.log('Stream started via API');

    res.json({
      message: 'Attack stream started',
      status: 'running',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/stream/stop
 * Stop the attack stream
 */
app.post('/api/stream/stop', (req, res) => {
  try {
    if (!attackStreamService.getStatus()) {
      return res.status(400).json({ error: 'Attack stream is not running' });
    }

    attackStreamService.stop();
    console.log('Stream stopped via API');

    res.json({
      message: 'Attack stream stopped',
      status: 'stopped',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/stream/pattern
 * Change the attack pattern
 */
app.post('/api/stream/pattern', (req, res) => {
  try {
    const { pattern } = req.body;

    if (!pattern) {
      return res.status(400).json({ error: 'Pattern parameter is required' });
    }

    const success = attackStreamService.setAttackPattern(pattern);

    if (!success) {
      return res.status(400).json({
        error: `Invalid pattern: ${pattern}`,
        validPatterns: ['normal', 'wave', 'sustained', 'calm'],
      });
    }

    console.log(`Pattern changed to: ${pattern} via API`);

    res.json({
      message: `Attack pattern changed to: ${pattern}`,
      pattern: pattern,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

/**
 * Graceful shutdown handler
 */
function setupGracefulShutdown() {
  process.on('SIGINT', async () => {
    console.log('\n\nShutting down gracefully...');

    // Stop attack stream
    if (attackStreamService.getStatus()) {
      attackStreamService.stop();
    }

    // Close server
    server.close(() => {
      console.log('✓ Server closed');
      process.exit(0);
    });

    // Force exit after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after 10 seconds');
      process.exit(1);
    }, 10000);
  });
}

/**
 * Start the server
 */
const server = app.listen(PORT, async () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  SOC Security Attack Simulation Server`);
  console.log(`${'='.repeat(60)}\n`);

  // Initialize application
  await initialize();

  console.log(`\n✓ Server listening on port ${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /api/health              - Health check`);
  console.log(`  GET  /api/stream/status       - Stream status and statistics`);
  console.log(`  POST /api/stream/start        - Start the attack stream`);
  console.log(`  POST /api/stream/stop         - Stop the attack stream`);
  console.log(`  POST /api/stream/pattern      - Change attack pattern`);
  console.log(`\nPress Ctrl+C to shutdown\n`);

  setupGracefulShutdown();
});

module.exports = app;
