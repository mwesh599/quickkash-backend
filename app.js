const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env
dotenv.config();

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json()); // 💡 Parses incoming JSON requests

// ======================
// ROUTES
// ======================
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // e.g., /api/auth/register, /api/auth/login

// Root route for health check
app.get('/', (req, res) => {
  res.send('🚀 QuickKash API is running...');
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// ======================
// MONGODB CONNECTION + SERVER START
// ======================
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1); // optional: stop app if DB fails
  });

// Optional: export app for testing
module.exports = app;
