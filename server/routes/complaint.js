const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// GET all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new complaint
router.post('/', async (req, res) => {
  try {
    const newComplaint = new Complaint(req.body);
    const saved = await newComplaint.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update complaint status (Admin / Maintenance)
router.put('/:id/status', async (req, res) => {
  try {
    const { status, assignedTo, resolutionNote } = req.body;
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo, resolutionNote },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Complaint not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
