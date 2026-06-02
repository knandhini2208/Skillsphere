const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getDashboardStats, getUsers, suspendUser,
  verifyFreelancer, getDisputes, resolveDispute, approveGig,
} = require('../controllers/admin.controller');

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/suspend', suspendUser);
router.put('/freelancers/:id/verify', verifyFreelancer);
router.get('/disputes', getDisputes);
router.put('/disputes/:id/resolve', resolveDispute);
router.put('/gigs/:id/approve', approveGig);

module.exports = router;
