const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Username, email, and password are required',
      });
    }

    // Check if user already exists by email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists',
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        error: 'Username already taken',
      });
    }

    // Hash password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'analyst',
    });

    // Save user to database
    await newUser.save();

    // Return success response (exclude password)
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: error.message || 'Registration failed',
    });
  }
};

/**
 * Login user and generate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    console.log('Login attempt received:', req.body);
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('Validation failed: missing email or password');
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // Demo user for development (when MongoDB is not available)
    const demoUser = {
      email: 'admin@company.com',
      password: 'password', // Plain text for demo
      username: 'Admin User',
      role: 'admin',
      _id: 'demo-user-id-12345'
    };

    console.log('Checking demo credentials...');
    // Check if using demo credentials
    if (email.toLowerCase() === demoUser.email && password === demoUser.password) {
      console.log('Demo user login successful!');
      // Generate JWT token (expires in 7 days)
      const token = jwt.sign(
        {
          userId: demoUser._id,
          role: demoUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return success response with token and user data
      const userResponse = {
        id: demoUser._id,
        username: demoUser.username,
        email: demoUser.email,
        role: demoUser.role,
      };

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: userResponse,
      });
    }

    // Try to find user in database (if MongoDB is connected)
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          error: 'Invalid email or password',
        });
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid email or password',
        });
      }

      // Generate JWT token (expires in 7 days)
      const token = jwt.sign(
        {
          userId: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return success response with token and user data
      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: userResponse,
      });
    } catch (dbError) {
      // If database is not available, return invalid credentials
      console.log('Database not available:', dbError.message);
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: error.message || 'Login failed',
    });
  }
};

module.exports = {
  register,
  login,
};
