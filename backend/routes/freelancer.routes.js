const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const Freelancer = require('../models/Freelancer.model');

// Get all freelancers (with AI-style skill matching)
router.get('/', async (req, res) => {
  try {
    const { skills, city, minRating, page = 1, limit = 12, search } = req.query;
    const query = {};
    if (skills) query['skills.name'] = { $in: skills.split(',') };
    if (city) query['serviceArea.city'] = new RegExp(city, 'i');
    if (minRating) query.averageRating = { $gte: Number(minRating) };
    if (search) query.$text = { $search: search };

    const freelancers = await Freelancer.find(query)
      .populate('user', 'name avatar location isEmailVerified createdAt')
      .sort({ reputationScore: -1, averageRating: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, count: freelancers.length, data: freelancers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get freelancer by user ID
router.get('/:userId', async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ user: req.params.userId })
      .populate('user', 'name avatar location createdAt');
    if (!freelancer) return res.status(404).json({ success: false, message: 'Freelancer not found' });
    res.json({ success: true, data: freelancer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update freelancer profile
router.put('/me', protect, authorize('freelancer'), async (req, res) => {
  try {
    const freelancer = await Freelancer.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true, upsert: true }
    );
    res.json({ success: true, data: freelancer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
