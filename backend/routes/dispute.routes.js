const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Dispute = require('../models/Dispute.model');

router.post('/', protect, async (req, res) => {
  try {
    const dispute = await Dispute.create({ ...req.body, raisedBy: req.user._id });
    res.status(201).json({ success: true, data: dispute });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  const disputes = await Dispute.find({ $or: [{ raisedBy: req.user._id }, { againstUser: req.user._id }] })
    .populate('gig', 'title').sort('-createdAt');
  res.json({ success: true, data: disputes });
});

module.exports = router;
