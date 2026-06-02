const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    conversation: { type: String, required: true }, // "userId1_userId2" sorted
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String },
    messageType: {
      type: String,
      enum: ['text', 'file', 'image', 'system'],
      default: 'text',
    },
    fileUrl: String,
    fileName: String,
    isRead: { type: Boolean, default: false },
    readAt: Date,
    isDeleted: { type: Boolean, default: false },
    gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }, // context
  },
  { timestamps: true }
);

MessageSchema.index({ conversation: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);
