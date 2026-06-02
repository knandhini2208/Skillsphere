const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Review = require('../models/Review.model');
const Freelancer = require('../models/Freelancer.model');

router.post('/', protect, async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, reviewer: req.user._id, ipAddress: req.ip });
    // Update freelancer reputation
    if (req.body.revieweeRole === 'freelancer') {
      const freelancer = await Freelancer.findOne({ user: req.body.reviewee });
      if (freelancer) {
        freelancer.updateRating(req.body.rating);
        freelancer.reputationScore = Math.min(100, freelancer.averageRating * 20);
        await freelancer.save();
      }
    }
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar')
      .sort('-createdAt');
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
