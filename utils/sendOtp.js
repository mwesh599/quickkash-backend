const otpStore = new Map(); // You can use DB later for persistence

// Generate and store OTP
function generateOtp(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // expires in 5 mins
  console.log(`OTP for ${email}: ${otp}`); // simulate sending OTP
  return otp;
}

// Validate OTP
function validateOtp(email, otp) {
  const record = otpStore.get(email);
  if (!record) return false;
  const isValid = record.otp === otp && Date.now() < record.expiresAt;
  if (isValid) otpStore.delete(email); // one-time use
  return isValid;
}

module.exports = { generateOtp, validateOtp };
// This module provides functions to generate and validate OTPs for user authentication.
// It uses an in-memory store (Map) for simplicity, but can be extended to use a database for persistence.
// The `generateOtp` function creates a 6-digit OTP, stores it with an expiration time, and simulates sending it to the user.
// The `validateOtp` function checks if the provided OTP matches the stored one and is still valid (not expired).
// If valid, it deletes the OTP from the store to ensure it's used only once.