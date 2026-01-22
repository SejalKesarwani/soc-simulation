require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./backend/routes/auth');
const incidentRoutes = require('./backend/routes/incidents');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server running' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Incident routes
app.use('/api/incidents', incidentRoutes);

// 404 Error Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    error: {
      message: message,
      status: statusCode,
      timestamp: new Date().toISOString(),
    },
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`CORS enabled for http://localhost:5173`);
});

module.exports = app;
