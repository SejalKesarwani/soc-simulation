const mongoose = require('mongoose');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

const connectDB = async () => {
  try {
    const mongodbUri = process.env.MONGODB_URI;

    if (!mongodbUri) {
      console.log(
        `${colors.yellow}⚠ MongoDB URI not configured, running without database${colors.reset}`
      );
      return;
    }

    await mongoose.connect(mongodbUri);

    console.log(
      `${colors.green}✓ MongoDB Connected Successfully${colors.reset}`
    );
    console.log(`${colors.green}  Database URI: ${mongodbUri}${colors.reset}`);
  } catch (error) {
    console.error(
      `${colors.red}✗ MongoDB Connection Error${colors.reset}`,
      error.message
    );
    console.log(
      `${colors.yellow}⚠ Server will continue without database${colors.reset}`
    );
    // Don't exit - allow server to run without DB for development
  }
};

module.exports = connectDB;
