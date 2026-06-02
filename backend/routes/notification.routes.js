const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Notification = require('../models/Notification.model');

router.get('/', protect, async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id }).sort('-createdAt').limit(50);
  res.json({ success: true, data: notifications });
});

router.put('/:id/read', protect, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true, readAt: Date.now() });
  res.json({ success: true, message: 'Marked as read' });
});

router.put('/read-all', protect, async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true, readAt: Date.now() });
  res.json({ success: true, message: 'All notifications marked as read' });
});

module.exports = router;
