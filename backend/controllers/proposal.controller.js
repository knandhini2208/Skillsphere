const Proposal = require('../models/Proposal.model');
const Gig = require('../models/Gig.model');
const { createNotification } = require('../utils/notification');

// @route POST /api/proposals/:gigId
exports.submitProposal = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig || gig.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Gig not available' });
    }

    const existing = await Proposal.findOne({ gig: req.params.gigId, freelancer: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already applied to this gig' });
    }

    const proposal = await Proposal.create({
      ...req.body,
      gig: req.params.gigId,
      freelancer: req.user._id,
    });

    gig.proposalCount += 1;
    await gig.save();

    const io = req.app.get('io');
    await createNotification(io, {
      recipient: gig.client,
      type: 'proposal_received',
      title: 'New Proposal Received',
      message: `You received a proposal for: ${gig.title}`,
      link: `/gigs/${gig._id}/proposals`,
    });

    res.status(201).json({ success: true, message: 'Proposal submitted', data: proposal });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Already applied to this gig' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/proposals/gig/:gigId
exports.getGigProposals = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const proposals = await Proposal.find({ gig: req.params.gigId })
      .populate('freelancer', 'name avatar location')
      .sort('-createdAt');

    res.json({ success: true, count: proposals.length, data: proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/proposals/:id/accept
exports.acceptProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('gig');
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });
    if (proposal.gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    proposal.status = 'accepted';
    proposal.acceptedAt = Date.now();
    await proposal.save();

    // Update gig status and assign freelancer
    await Gig.findByIdAndUpdate(proposal.gig._id, {
      status: 'in_progress',
      assignedFreelancer: proposal.freelancer,
    });

    // Reject other proposals
    await Proposal.updateMany(
      { gig: proposal.gig._id, _id: { $ne: proposal._id } },
      { status: 'rejected' }
    );

    const io = req.app.get('io');
    await createNotification(io, {
      recipient: proposal.freelancer,
      type: 'proposal_accepted',
      title: 'Proposal Accepted! 🎉',
      message: `Your proposal for "${proposal.gig.title}" was accepted!`,
      link: `/gigs/${proposal.gig._id}`,
    });

    res.json({ success: true, message: 'Proposal accepted', data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/proposals/:id/reject
exports.rejectProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('gig');
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });
    if (proposal.gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    proposal.status = 'rejected';
    proposal.rejectedAt = Date.now();
    proposal.rejectionReason = req.body.reason || '';
    await proposal.save();

    const io = req.app.get('io');
    await createNotification(io, {
      recipient: proposal.freelancer,
      type: 'proposal_rejected',
      title: 'Proposal Update',
      message: `Your proposal for "${proposal.gig.title}" was not selected.`,
      link: `/proposals/my`,
    });

    res.json({ success: true, message: 'Proposal rejected', data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/proposals/my
exports.getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user._id })
      .populate('gig', 'title status budgetMin budgetMax client')
      .sort('-createdAt');
    res.json({ success: true, count: proposals.length, data: proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
