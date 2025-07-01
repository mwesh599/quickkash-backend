const express = require('express');
const router = express.Router();

// Import controller functions
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail
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
// @desc    Send OTP to user email
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset user password using OTP
// @access  Public
router.post('/reset-password', resetPassword);

// ✅ NEW
// @route   POST /api/auth/verify-email
// @desc    Verify email with OTP and activate account
// @access  Public
router.post('/verify-email', verifyEmail);

module.exports = router;

/*
  Routes Overview:
  - /register: Create new account & send OTP
  - /login: Login if verified
  - /forgot-password: Generate & send OTP for reset
  - /reset-password: Use OTP to reset password
  - /verify-email: Use OTP to activate account
*/
