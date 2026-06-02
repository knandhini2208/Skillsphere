const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const User = require('../models/User.model');
const Freelancer = require('../models/Freelancer.model');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');

// Helper: send token response
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  user.lastLogin = Date.now();
  user.save({ validateBeforeSave: false });

  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
    },
  });
};

// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role: role || 'client' });

    // Create freelancer profile if role is freelancer
    if (user.role === 'freelancer') {
      await Freelancer.create({ user: user._id });
    }

    // Send verification email
    const token = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });
    await sendVerificationEmail(user, token);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password +twoFactorSecret');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' });
    }

    // If 2FA enabled, request OTP
    if (user.twoFactorEnabled) {
      return res.status(200).json({
        success: true,
        requiresTwoFactor: true,
        userId: user._id,
        message: 'Please enter your 2FA code',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/auth/verify-2fa
exports.verifyTwoFactor = async (req, res) => {
  try {
    const { userId, token } = req.body;
    const user = await User.findById(userId).select('+twoFactorSecret');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      return res.status(400).json({ success: false, message: 'Invalid 2FA code' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/auth/verify-email/:token
exports.verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'No user with that email' });

    const token = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
    await sendPasswordResetEmail(user, token);

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/auth/refresh-token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const accessToken = user.generateAccessToken();
    res.json({ success: true, accessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

// @route POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/auth/setup-2fa
exports.setupTwoFactor = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ name: `SkillSphere:${req.user.email}` });
    await User.findByIdAndUpdate(req.user._id, { twoFactorSecret: secret.base32 }, { new: true });

    res.json({
      success: true,
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/auth/enable-2fa
exports.enableTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+twoFactorSecret');
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: req.body.token,
      window: 2,
    });

    if (!verified) return res.status(400).json({ success: false, message: 'Invalid code' });

    user.twoFactorEnabled = true;
    await user.save();

    res.json({ success: true, message: '2FA enabled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Google OAuth callback
exports.googleCallback = async (req, res) => {
  const accessToken = req.user.generateAccessToken();
  const refreshToken = req.user.generateRefreshToken();
  req.user.refreshToken = refreshToken;
  await req.user.save({ validateBeforeSave: false });

  res.redirect(`${process.env.CLIENT_URL}/oauth/callback?token=${accessToken}&refresh=${refreshToken}`);
};
