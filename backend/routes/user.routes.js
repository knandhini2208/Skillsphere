const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Inline controller for brevity
const User = require('../models/User.model');
const Freelancer = require('../models/Freelancer.model');

router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, data: user });
});

router.put('/me', protect, async (req, res) => {
  const { name, phone, location, avatar } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, phone, location, avatar }, { new: true, runValidators: true });
  res.json({ success: true, data: user });
});

router.put('/me/password', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }
  user.password = req.body.newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});

module.exports = router;
