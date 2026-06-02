const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');
const {
  register, login, verifyTwoFactor, verifyEmail, forgotPassword,
  resetPassword, refreshToken, logout, setupTwoFactor, enableTwoFactor, googleCallback,
} = require('../controllers/auth.controller');

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('role').optional().isIn(['client', 'freelancer']),
  validate,
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
  validate,
], login);

router.post('/verify-2fa', verifyTwoFactor);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.post('/setup-2fa', protect, setupTwoFactor);
router.post('/enable-2fa', protect, enableTwoFactor);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth` }),
  googleCallback
);

module.exports = router;
