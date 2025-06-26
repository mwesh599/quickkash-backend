const express = require('express');
const router = express.Router();

// Import controller functions
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/auth/forgot-password
// @desc    Send OTP to user email (simulated)
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset user password using OTP
// @access  Public
router.post('/reset-password', resetPassword);

module.exports = router;

/*
  Routes Overview:
  - /register: Create new account
  - /login: Authenticate and return token
  - /forgot-password: Generate & "send" OTP to user (simulated)
  - /reset-password: Accept OTP + new password and update account

  These routes are powered by authController.js logic.
  This modular structure keeps your backend organized and scalable.
*/
