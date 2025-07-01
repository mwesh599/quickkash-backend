const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  isActivated: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  referralCode: { type: String },
  referredBy: { type: String },
  spinUsedToday: { type: Boolean, default: false },

  // ✅ Email Verification Fields
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
