const User = require('../models/User.model');
const Gig = require('../models/Gig.model');
const Payment = require('../models/Payment.model');
const Review = require('../models/Review.model');
const Dispute = require('../models/Dispute.model');
const Freelancer = require('../models/Freelancer.model');

// @route GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalFreelancers, totalClients, totalGigs,
           openGigs, completedGigs, totalPayments, activeDisputes] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'freelancer' }),
      User.countDocuments({ role: 'client' }),
      Gig.countDocuments(),
      Gig.countDocuments({ status: 'open' }),
      Gig.countDocuments({ status: 'completed' }),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' }, fee: { $sum: '$platformFee' } } }]),
      Dispute.countDocuments({ status: 'open' }),
    ]);

    const revenue = totalPayments[0] || { total: 0, fee: 0 };

    // Top categories
    const topCategories = await Gig.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Monthly revenue (last 6 months)
    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'captured', createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, freelancers: totalFreelancers, clients: totalClients },
        gigs: { total: totalGigs, open: openGigs, completed: completedGigs },
        revenue: { total: revenue.total, platformFee: revenue.fee },
        disputes: activeDisputes,
        topCategories,
        monthlyRevenue,
        successRate: totalGigs > 0 ? ((completedGigs / totalGigs) * 100).toFixed(1) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, status } = req.query;
    const query = {};
    if (role) query.role = role;
    if (status === 'suspended') query.isSuspended = true;
    if (status === 'active') query.isSuspended = false;
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/admin/users/:id/suspend
exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended: req.body.suspend },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({
      success: true,
      message: `User ${req.body.suspend ? 'suspended' : 'unsuspended'}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/admin/freelancers/:id/verify
exports.verifyFreelancer = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOneAndUpdate(
      { user: req.params.id },
      { isVerified: true, verificationBadge: req.body.badge || 'basic' },
      { new: true }
    );
    if (!freelancer) return res.status(404).json({ success: false, message: 'Freelancer not found' });
    res.json({ success: true, message: 'Freelancer verified', data: freelancer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/admin/disputes
exports.getDisputes = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const disputes = await Dispute.find(query)
      .populate('gig', 'title')
      .populate('raisedBy', 'name email')
      .populate('againstUser', 'name email')
      .sort('-createdAt');
    res.json({ success: true, count: disputes.length, data: disputes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/admin/disputes/:id/resolve
exports.resolveDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        adminNotes: req.body.notes,
        resolution: req.body.resolution,
        resolvedBy: req.user._id,
        resolvedAt: Date.now(),
      },
      { new: true }
    );
    if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });
    res.json({ success: true, message: 'Dispute resolved', data: dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/admin/gigs/:id/approve
exports.approveGig = async (req, res) => {
  try {
    const gig = await Gig.findByIdAndUpdate(
      req.params.id,
      { isApproved: req.body.approve },
      { new: true }
    );
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    res.json({ success: true, message: `Gig ${req.body.approve ? 'approved' : 'rejected'}`, data: gig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
