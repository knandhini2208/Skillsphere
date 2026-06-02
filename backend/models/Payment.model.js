const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    platformFee: { type: Number, default: 0 }, // 10% platform cut
    freelancerAmount: { type: Number },
    currency: { type: String, default: 'INR' },
    type: {
      type: String,
      enum: ['escrow', 'milestone', 'full', 'refund'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'captured', 'released', 'refunded', 'failed', 'disputed'],
      default: 'pending',
    },
    // Razorpay
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    // Milestone reference
    milestoneId: String,
    // Metadata
    description: String,
    paidAt: Date,
    releasedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
