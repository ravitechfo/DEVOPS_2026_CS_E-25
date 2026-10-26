const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  urgency: { type: String, enum: ['High', 'Normal', 'Low'], default: 'Normal' },
  location: { type: String, default: 'Campus Premises' },
  reportedBy: { type: String, default: 'Student' },
  date: { type: String, default: () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
  description: { type: String, required: true },
  status: { type: String, enum: ['Submitted', 'In Progress', 'Resolved'], default: 'Submitted' },
  assignedTo: { type: String, default: 'Campus Maintenance Desk' },
  resolutionNote: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
