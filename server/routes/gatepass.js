const express = require('express');
const router = express.Router();
const GatePass = require('../models/GatePass');

// Get all gate passes
router.get('/', async (req, res) => {
  try {
    const passes = await GatePass.find().sort({ createdAt: -1 });
    res.json(passes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply for a gate pass
router.post('/apply', async (req, res) => {
  try {
    const passCodeNum = Math.floor(1000 + Math.random() * 9000);
    const passCode = `GP-2026-${passCodeNum}`;
    const newPass = new GatePass({
      passCode,
      ...req.body
    });
    const saved = await newPass.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update pass status (Warden Approve / Reject)
router.put('/:id/status', async (req, res) => {
  try {
    const { status, wardenName, guardianConsent, guardianConsentNote, rejectionReason } = req.body;
    const pass = await GatePass.findByIdAndUpdate(
      req.params.id,
      { status, wardenName, guardianConsent, guardianConsentNote, rejectionReason },
      { new: true }
    );
    if (!pass) return res.status(404).json({ error: 'Gate pass not found' });
    res.json(pass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
