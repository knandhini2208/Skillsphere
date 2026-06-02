const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema(
  {
    gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverLetter: { type: String, required: true, maxlength: 1000 },
    bidAmount: { type: Number, required: true },
    estimatedDays: { type: Number, required: true },
    milestones: [
      {
        title: String,
        description: String,
        amount: Number,
        dueDate: Date,
      },
    ],
    attachments: [{ name: String, url: String }],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn', 'negotiating'],
      default: 'pending',
    },
    negotiationHistory: [
      {
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: Number,
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    acceptedAt: Date,
    rejectedAt: Date,
    rejectionReason: String,
  },
  { timestamps: true }
);

// One proposal per freelancer per gig
ProposalSchema.index({ gig: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('Proposal', ProposalSchema);
