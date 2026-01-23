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
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `${colors.green}✓ MongoDB Connected Successfully${colors.reset}`
    );
    console.log(`${colors.green}  Database URI: ${mongodbUri}${colors.reset}`);
  } catch (error) {
    console.error(
      `${colors.red}✗ MongoDB Connection Error${colors.reset}`,
      error.message
    );
    process.exit(1);
  }
};

module.exports = connectDB;
