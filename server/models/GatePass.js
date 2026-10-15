const mongoose = require('mongoose');

const GatePassSchema = new mongoose.Schema({
  passCode: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  rollNo: { type: String, required: true },
  hostelBlock: { type: String, required: true },
  roomNo: { type: String, required: true },
  outingType: { type: String, required: true },
  destination: { type: String, required: true },
  purpose: { type: String, required: true },
  departureDate: { type: String, required: true },
  departureTime: { type: String, required: true },
  expectedReturnDate: { type: String, required: true },
  expectedReturnTime: { type: String, required: true },
  guardianName: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  guardianConsent: { type: String, default: 'Pending Warden Call' },
  guardianConsentNote: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Out of Campus', 'Completed', 'Rejected'], default: 'Pending' },
  qrCodeData: { type: String },
  wardenName: { type: String },
  securityCheckOut: { type: String },
  securityCheckIn: { type: String },
  appliedAt: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('GatePass', GatePassSchema);
