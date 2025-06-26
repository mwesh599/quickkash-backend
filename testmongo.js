const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://shad:quickcash12345@quickkash-cluster.s1qpcbt.mongodb.net/quickkashdb?retryWrites=true&w=majority')
  .then(() => {
    console.log('✅ MongoDB connected');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });

  