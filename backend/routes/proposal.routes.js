const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { submitProposal, getGigProposals, acceptProposal, rejectProposal, getMyProposals } = require('../controllers/proposal.controller');

router.post('/gig/:gigId', protect, authorize('freelancer'), submitProposal);
router.get('/gig/:gigId', protect, authorize('client', 'admin'), getGigProposals);
router.get('/my', protect, authorize('freelancer'), getMyProposals);
router.put('/:id/accept', protect, authorize('client'), acceptProposal);
router.put('/:id/reject', protect, authorize('client'), rejectProposal);

module.exports = router;
