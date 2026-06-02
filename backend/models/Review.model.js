const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 500 },
    categories: {
      communication: { type: Number, min: 1, max: 5 },
      quality: { type: Number, min: 1, max: 5 },
      timeliness: { type: Number, min: 1, max: 5 },
      expertise: { type: Number, min: 1, max: 5 },
    },
    isVerified: { type: Boolean, default: true },
    isFlagged: { type: Boolean, default: false },
    flagReason: String,
    // Fraud detection
    ipAddress: String,
    deviceFingerprint: String,
  },
  { timestamps: true }
);

// One review per gig per direction
ReviewSchema.index({ gig: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
