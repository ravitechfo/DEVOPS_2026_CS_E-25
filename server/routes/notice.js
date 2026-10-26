const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

// GET all notices
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new notice (Admin / Faculty)
router.post('/', async (req, res) => {
  try {
    const newNotice = new Notice(req.body);
    const saved = await newNotice.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE notice by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Notice not found' });
    res.json({ message: 'Notice deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
