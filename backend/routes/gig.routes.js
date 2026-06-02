const express = require('express');
const router = express.Router();
const { protect, authorize, requireEmailVerified } = require('../middleware/auth.middleware');
const {
  getGigs, getGig, createGig, updateGig, deleteGig,
  getMyGigs, inviteFreelancer, completeMilestone,
} = require('../controllers/gig.controller');

router.get('/', getGigs);
router.get('/my', protect, getMyGigs);
router.get('/:id', getGig);
router.post('/', protect, authorize('client'), requireEmailVerified, createGig);
router.put('/:id', protect, authorize('client', 'admin'), updateGig);
router.delete('/:id', protect, authorize('client', 'admin'), deleteGig);
router.post('/:id/invite/:freelancerId', protect, authorize('client'), inviteFreelancer);
router.put('/:id/milestone/:milestoneId/complete', protect, completeMilestone);

module.exports = router;
