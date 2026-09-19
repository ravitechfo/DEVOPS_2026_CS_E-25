const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  collegeName: { type: String, default: 'SKIT Jaipur' },
  rollNo: { type: String, default: '' },
  enrollmentNo: { type: String, default: '' },
  department: { type: String, default: 'Computer Science & Engineering' },
  semester: { type: String, default: '5th Semester (Section A)' },
  isVerified: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Pending' },
  idCardProofUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

