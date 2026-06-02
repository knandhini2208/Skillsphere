const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema(
  {
    gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    againstUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    reason: { type: String, required: true },
    description: { type: String, required: true },
    evidence: [{ name: String, url: String, uploadedBy: mongoose.Schema.Types.ObjectId }],
    status: {
      type: String,
      enum: ['open', 'under_review', 'resolved_client', 'resolved_freelancer', 'closed'],
      default: 'open',
    },
    adminNotes: String,
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: Date,
    resolution: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dispute', DisputeSchema);
