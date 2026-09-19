const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function isSkitInstitutionalDomain(email) {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return lower.endsWith('@skit.ac.in') || lower.endsWith('.skit.ac.in') || lower.endsWith('@campus.edu');
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, rollNo, department, semester, idCardProofUrl } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const isInstitutional = isSkitInstitutionalDomain(email);
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      collegeName: 'SKIT Jaipur',
      rollNo: rollNo || (isInstitutional ? email.split('@')[0].toUpperCase() : ''),
      department: department || 'Computer Science & Engineering',
      semester: semester || '5th Semester (Section A)',
      isVerified: isInstitutional,
      verificationStatus: isInstitutional ? 'Approved' : 'Pending',
      idCardProofUrl: idCardProofUrl || ''
    });

    await user.save();
    res.status(201).json({
      message: isInstitutional 
        ? 'Verified SKIT user registered successfully!' 
        : 'Registration received! Institutional verification pending admin review.',
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Email or Password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Email or Password' });

    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role, 
        name: user.name, 
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        rollNo: user.rollNo
      }, 
      process.env.JWT_SECRET || 'smart_campus_jwt_secret_key_2026', 
      { expiresIn: '1d' }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      rollNo: user.rollNo,
      department: user.department,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
