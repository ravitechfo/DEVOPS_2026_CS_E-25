const express = require('express');
const router = express.Router();
const LibraryResource = require('../models/LibraryResource');

// Get all library resources with optional filtering
router.get('/', async (req, res) => {
  try {
    const { dept, sem, q } = req.query;
    let query = {};
    if (dept && dept !== 'ALL') query.dept = dept;
    if (sem && sem !== 'ALL') query.sem = parseInt(sem);
    if (q) {
      query.$or = [
        { subjectName: { $regex: q, $options: 'i' } },
        { subjectCode: { $regex: q, $options: 'i' } }
      ];
    }
    const resources = await LibraryResource.find(query);
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new resource
router.post('/', async (req, res) => {
  try {
    const newRes = new LibraryResource(req.body);
    const saved = await newRes.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
