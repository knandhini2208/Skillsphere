const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  amount: { type: Number, required: true },
  dueDate: Date,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'approved', 'disputed'],
    default: 'pending',
  },
  completedAt: Date,
  evidence: [String], // file URLs
});

const GigSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true },
    category: { type: String, required: true },
    skills: [{ type: String, required: true }],
    budgetType: {
      type: String,
      enum: ['fixed', 'hourly', 'milestone'],
      default: 'fixed',
    },
    budgetMin: { type: Number, required: true },
    budgetMax: { type: Number, required: true },
    milestones: [MilestoneSchema],
    deadline: Date,
    duration: {
      type: String,
      enum: ['less_than_week', '1_2_weeks', '1_month', 'more_than_month'],
    },
    attachments: [{ name: String, url: String }],
    location: {
      type: { type: String, enum: ['remote', 'onsite', 'hybrid'], default: 'remote' },
      city: String,
      country: String,
    },
    status: {
      type: String,
      enum: ['draft', 'open', 'in_progress', 'completed', 'cancelled', 'disputed'],
      default: 'open',
    },
    visibility: {
      type: String,
      enum: ['public', 'invite_only'],
      default: 'public',
    },
    assignedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    invitedFreelancers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    proposalCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true }, // Admin can reject
    completedAt: Date,
  },
  { timestamps: true }
);

GigSchema.index({ title: 'text', description: 'text', skills: 'text' });
GigSchema.index({ 'location.city': 1, status: 1, category: 1 });

module.exports = mongoose.model('Gig', GigSchema);
