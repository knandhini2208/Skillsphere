const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Message = require('../models/Message.model');

const getConversationId = (id1, id2) => [id1, id2].sort().join('_');

router.get('/conversation/:userId', protect, async (req, res) => {
  try {
    const convId = getConversationId(req.user._id.toString(), req.params.userId);
    const messages = await Message.find({ conversation: convId })
      .populate('sender', 'name avatar')
      .sort('createdAt');
    // Mark as read
    await Message.updateMany({ conversation: convId, receiver: req.user._id, isRead: false }, { isRead: true, readAt: Date.now() });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/send/:userId', protect, async (req, res) => {
  try {
    const convId = getConversationId(req.user._id.toString(), req.params.userId);
    const message = await Message.create({
      ...req.body,
      conversation: convId,
      sender: req.user._id,
      receiver: req.params.userId,
    });
    const populated = await message.populate('sender', 'name avatar');
    // Emit to socket room
    const io = req.app.get('io');
    io.to(`user_${req.params.userId}`).emit('new_message', populated);
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/conversations', protect, async (req, res) => {
  try {
    const convs = await Message.aggregate([
      { $match: { $or: [{ sender: req.user._id }, { receiver: req.user._id }] } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$conversation', lastMessage: { $first: '$$ROOT' }, unread: { $sum: { $cond: [{ $and: [{ $eq: ['$receiver', req.user._id] }, { $eq: ['$isRead', false] }] }, 1, 0] } } } },
    ]);
    res.json({ success: true, data: convs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
