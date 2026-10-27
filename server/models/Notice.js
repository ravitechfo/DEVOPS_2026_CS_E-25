const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  priority: { type: String, enum: ['Urgent', 'Important', 'Normal'], default: 'Normal' },
  date: { type: String, default: () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
  author: { type: String, default: 'Campus Administration' },
  content: { type: String, required: true },
  badgeClass: { type: String, default: 'tag-academic' },
  isUrgent: { type: Boolean, default: false },
  attachment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', NoticeSchema);

