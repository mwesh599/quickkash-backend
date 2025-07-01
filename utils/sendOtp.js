const otpStore = new Map(); // In-memory store (replace with DB for production)

/**
 * Generate and store a 6-digit OTP for an email or phone number.
 * @param {string} identifier - Email or phone number
 * @returns {string} OTP
 */
function generateOtp(identifier) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(identifier, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  console.log(`OTP for ${identifier}: ${otp}`); // Simulate sending OTP (for now)
  return otp;
}

/**
 * Validate a submitted OTP against the stored one.
 * @param {string} identifier - Email or phone number
 * @param {string} otp - OTP entered by the user
 * @returns {boolean} true if valid and not expired
 */
function validateOtp(identifier, otp) {
  const record = otpStore.get(identifier);
  if (!record) return false;

  const isValid = record.otp === otp && Date.now() < record.expiresAt;
  if (isValid) {
    otpStore.delete(identifier); // One-time use
    return true;
  }

  return false;
}

module.exports = {
  generateOtp,
  validateOtp,
  otpStore // optional: for testing/debug
};
