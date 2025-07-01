const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOtp, validateOtp } = require('../utils/sendOtp');
const sendEmail = require('../utils/sendEmail');

// =======================
// Register User
// =======================
const registerUser = async (req, res) => {
  try {
    // 👇 Debug: log the request body
    console.log('📦 Incoming registration data:', req.body);

    const { name, phone, email, password, referralCode } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userReferralCode = Math.random().toString(36).substring(2, 8);

    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      referralCode: userReferralCode,
      referredBy: referralCode || null,
      isActivated: false
    });

    await newUser.save();

    // Send OTP to email
    const otp = generateOtp(email);
    const html = `
      <h3>QuickKash Email Verification</h3>
      <p>Hi ${name},</p>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>Please use this code to activate your account.</p>
    `;

    await sendEmail(email, 'Verify your QuickKash Email', html);

    res.status(201).json({ message: 'User registered. A verification code has been sent to your email.' });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// =======================
// Login User
// =======================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    if (!user.isActivated) {
      return res.status(403).json({ message: 'Please verify your email first.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isActivated: user.isActivated,
        walletBalance: user.walletBalance,
        referralCode: user.referralCode,
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// =======================
// Forgot Password (Request OTP)
// =======================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp(email);
    const html = `
      <h3>QuickKash Password Reset</h3>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>Use it to reset your password.</p>
    `;
    await sendEmail(email, 'Reset Your Password - QuickKash', html);

    res.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('❌ Forgot Password error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// =======================
// Reset Password (Verify OTP)
// =======================
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!validateOtp(email, otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('❌ Reset Password error:', error);
    res.status(500).json({ message: 'Password reset failed' });
  }
};

// =======================
// Verify Email (OTP)
// =======================
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!validateOtp(email, otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await User.findOneAndUpdate({ email }, { isActivated: true });
    res.json({ message: 'Email verified successfully. Your account is now activated.' });
  } catch (error) {
    console.error('❌ Email Verification error:', error);
    res.status(500).json({ message: 'Email verification failed' });
  }
};

// =======================
// Export Controllers
// =======================
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail
};
