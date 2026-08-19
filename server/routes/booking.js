const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

router.get('/resources', verifyToken, async (req, res) => {
  const resources = await Resource.find();
  res.json(resources);
});

router.post('/book', verifyToken, async (req, res) => {
  try {
    const { resourceId, bookingDate, timeSlot } = req.body;
    const existingBooking = await Booking.findOne({ resourceId, bookingDate, timeSlot, status: 'Approved' });
    if (existingBooking) {
      return res.status(400).json({ message: 'Slot already booked by someone else!' });
    }

    const newBooking = new Booking({ userId: req.user.id, resourceId, bookingDate, timeSlot });
    await newBooking.save();
    res.status(201).json({ message: 'Booking request submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-bookings', verifyToken, async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id }).populate('resourceId', 'name location');
  res.json(bookings);
});

module.exports = router;
