const express = require('express');
const router = express.Router();
const LostFound = require('../models/LostFound');

// GET all lost and found items
router.get('/', async (req, res) => {
  try {
    const items = await LostFound.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST report new lost or found item
router.post('/', async (req, res) => {
  try {
    const newItem = new LostFound(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT claim item
router.put('/:id/claim', async (req, res) => {
  try {
    const updated = await LostFound.findByIdAndUpdate(
      req.params.id,
      { status: 'Claimed' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
