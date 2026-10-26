const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcampus';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ MongoDB Connected Successfully: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);
  } catch (err) {
    console.warn(`⚠️ MongoDB connection warning: ${err.message}. Running in resilient mode.`);
  }
};

module.exports = connectDB;
