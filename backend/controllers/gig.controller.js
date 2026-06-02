const Gig = require('../models/Gig.model');
const Freelancer = require('../models/Freelancer.model');
const { createNotification } = require('../utils/notification');

// @route GET /api/gigs
exports.getGigs = async (req, res) => {
  try {
    const {
      page = 1, limit = 12, category, skills, location,
      budgetMin, budgetMax, status = 'open', search, sort = '-createdAt',
    } = req.query;

    const query = { status, isApproved: true };

    if (category) query.category = category;
    if (location) query['location.city'] = new RegExp(location, 'i');
    if (budgetMin || budgetMax) {
      query.budgetMin = {};
      if (budgetMin) query.budgetMin.$gte = Number(budgetMin);
      if (budgetMax) query.budgetMax = { $lte: Number(budgetMax) };
    }
    if (skills) query.skills = { $in: skills.split(',').map(s => s.trim()) };
    if (search) query.$text = { $search: search };

    const total = await Gig.countDocuments(query);
    const gigs = await Gig.find(query)
      .populate('client', 'name avatar location')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: gigs.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: gigs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/gigs/:id
exports.getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('client', 'name avatar location createdAt')
      .populate('assignedFreelancer', 'name avatar');

    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });

    gig.views += 1;
    await gig.save();

    res.json({ success: true, data: gig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/gigs
exports.createGig = async (req, res) => {
  try {
    const gig = await Gig.create({ ...req.body, client: req.user._id });
    res.status(201).json({ success: true, message: 'Gig posted successfully', data: gig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/gigs/:id
exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updated = await Gig.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/gigs/:id
exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    if (gig.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await gig.deleteOne();
    res.json({ success: true, message: 'Gig deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/gigs/my
exports.getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ client: req.user._id }).sort('-createdAt');
    res.json({ success: true, count: gigs.length, data: gigs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/gigs/:id/invite/:freelancerId
exports.inviteFreelancer = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!gig.invitedFreelancers.includes(req.params.freelancerId)) {
      gig.invitedFreelancers.push(req.params.freelancerId);
      await gig.save();
    }

    const io = req.app.get('io');
    await createNotification(io, {
      recipient: req.params.freelancerId,
      type: 'new_gig',
      title: 'You have been invited to a gig!',
      message: `You've been invited to: ${gig.title}`,
      link: `/gigs/${gig._id}`,
    });

    res.json({ success: true, message: 'Freelancer invited' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/gigs/:id/milestone/:milestoneId/complete
exports.completeMilestone = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });

    const milestone = gig.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

    milestone.status = 'completed';
    milestone.completedAt = Date.now();
    if (req.body.evidence) milestone.evidence = req.body.evidence;

    await gig.save();
    res.json({ success: true, message: 'Milestone marked as completed', data: milestone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
