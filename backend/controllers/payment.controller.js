const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment.model');
const Gig = require('../models/Gig.model');
const { createNotification } = require('../utils/notification');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route POST /api/payments/create-order
exports.createOrder = async (req, res) => {
  try {
    const { gigId, amount, type, milestoneId } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });

    const amountInPaise = Math.round(amount * 100);
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `skillsphere_${Date.now()}`,
      notes: { gigId, type, milestoneId: milestoneId || '' },
    });

    const platformFee = amount * 0.1;
    const freelancerAmount = amount - platformFee;

    const payment = await Payment.create({
      gig: gigId,
      client: req.user._id,
      freelancer: gig.assignedFreelancer,
      amount,
      platformFee,
      freelancerAmount,
      type,
      milestoneId,
      razorpayOrderId: order.id,
      description: `Payment for: ${gig.title}`,
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: 'captured',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: Date.now(),
      },
      { new: true }
    ).populate('gig');

    const io = req.app.get('io');
    await createNotification(io, {
      recipient: payment.freelancer,
      type: 'payment_received',
      title: 'Payment Received',
      message: `Payment of ₹${payment.amount} received for "${payment.gig.title}"`,
      link: `/payments`,
    });

    res.json({ success: true, message: 'Payment verified', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/payments/history
exports.getPaymentHistory = async (req, res) => {
  try {
    const query = req.user.role === 'client'
      ? { client: req.user._id }
      : { freelancer: req.user._id };

    const payments = await Payment.find(query)
      .populate('gig', 'title')
      .populate('client', 'name avatar')
      .populate('freelancer', 'name avatar')
      .sort('-createdAt');

    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
