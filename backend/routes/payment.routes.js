const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { createOrder, verifyPayment, getPaymentHistory } = require('../controllers/payment.controller');

router.post('/create-order', protect, authorize('client'), createOrder);
router.post('/verify', protect, authorize('client'), verifyPayment);
router.get('/history', protect, getPaymentHistory);

module.exports = router;
