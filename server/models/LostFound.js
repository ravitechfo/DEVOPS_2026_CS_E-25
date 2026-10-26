const mongoose = require('mongoose');

const LostFoundSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  location: { type: String, required: true },
  dateTime: { type: String, default: () => new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
  description: { type: String, required: true },
  contactName: { type: String, required: true },
  contactPhone: { type: String, default: 'Security Desk' },
  status: { type: String, enum: ['Open', 'Claimed', 'Resolved'], default: 'Open' },
  icon: { type: String, default: '📦' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LostFound', LostFoundSchema);
