const mongoose = require('mongoose');

const PortfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  link: String,
  tags: [String],
});

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: String,
  issueDate: Date,
  expiryDate: Date,
  credentialUrl: String,
  image: String,
});

const WorkExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  location: String,
  from: { type: Date, required: true },
  to: Date,
  current: { type: Boolean, default: false },
  description: String,
});

const AvailabilitySlotSchema = new mongoose.Schema({
  date: Date,
  slots: [{ start: String, end: String }],
  isAvailable: { type: Boolean, default: true },
});

const FreelancerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: { type: String, maxlength: 500 },
    tagline: { type: String, maxlength: 100 },
    skills: [
      {
        name: { type: String, required: true },
        proficiency: {
          type: String,
          enum: ['beginner', 'intermediate', 'expert'],
          default: 'intermediate',
        },
      },
    ],
    categories: [String],
    hourlyRate: { type: Number, min: 0 },
    milestoneRate: { type: Number, min: 0 },
    portfolio: [PortfolioItemSchema],
    certifications: [CertificationSchema],
    workExperience: [WorkExperienceSchema],
    resume: { type: String }, // Cloudinary URL
    availability: [AvailabilitySlotSchema],
    isVerified: { type: Boolean, default: false },
    verificationBadge: {
      type: String,
      enum: ['none', 'basic', 'pro', 'expert'],
      default: 'none',
    },

    // Reputation
    reputationScore: { type: Number, default: 0, min: 0, max: 100 },
    totalRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },

    // Stats
    completedGigs: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },

    // Location (for hyperlocal matching)
    serviceArea: {
      city: String,
      radius: { type: Number, default: 20 }, // km
    },
  },
  { timestamps: true }
);

// Calculate average rating
FreelancerSchema.methods.updateRating = function (newRating) {
  this.ratingCount += 1;
  this.totalRating += newRating;
  this.averageRating = this.totalRating / this.ratingCount;
};

// Text index for search
FreelancerSchema.index({ 'skills.name': 'text', bio: 'text', tagline: 'text' });

module.exports = mongoose.model('Freelancer', FreelancerSchema);
