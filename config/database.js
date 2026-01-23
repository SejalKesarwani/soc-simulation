const mongoose = require('mongoose');

/**
 * Database connection configuration
 */
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/soc-simulation';

/**
 * Connects to MongoDB database
 * @returns {Promise} Connection promise
 */
async function connectDB() {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

/**
 * Disconnects from MongoDB database
 * @returns {Promise} Disconnection promise
 */
async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error.message);
  }
}

module.exports = {
  connectDB,
  disconnectDB,
};
