const mongoose = require('mongoose');

const LibraryResourceSchema = new mongoose.Schema({
  dept: { type: String, required: true },
  sem: { type: Number, required: true },
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  credits: { type: Number, default: 4 },
  facultyLead: { type: String, required: true },
  syllabus: {
    officialDoc: { type: String },
    units: [{
      unit: Number,
      title: String,
      topics: String
    }]
  },
  pyqs: [{
    year: Number,
    term: String,
    title: String,
    file: String,
    marks: String,
    solutionsAvailable: Boolean
  }],
  materials: [{
    type: { type: String },
    title: String,
    author: String,
    size: String,
    verified: Boolean
  }],
  videos: [{
    title: String,
    platform: String,
    link: String,
    lectures: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('LibraryResource', LibraryResourceSchema);
