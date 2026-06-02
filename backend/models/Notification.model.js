const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'new_gig', 'proposal_received', 'proposal_accepted', 'proposal_rejected',
        'payment_received', 'payment_released', 'review_added', 'message_received',
        'gig_completed', 'dispute_opened', 'dispute_resolved', 'account_verified',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: String,
    isRead: { type: Boolean, default: false },
    readAt: Date,
    data: mongoose.Schema.Types.Mixed, // extra context
  },
  { timestamps: true }
);

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
