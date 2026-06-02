const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email verification link
 */
const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your SkillSphere account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to SkillSphere, ${name}! 👋</h2>
        <p>Please verify your email address to get started.</p>
        <a href="${verifyUrl}" 
           style="background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin:16px 0;">
          Verify Email
        </a>
        <p style="color:#6b7280;font-size:14px;">This link expires in 24 hours.</p>
        <p style="color:#6b7280;font-size:14px;">If you didn't create this account, please ignore this email.</p>
      </div>
    `,
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your SkillSphere password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>Hi ${name}, we received a request to reset your password.</p>
        <a href="${resetUrl}"
           style="background:#dc2626;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin:16px 0;">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:14px;">This link expires in 30 minutes.</p>
        <p style="color:#6b7280;font-size:14px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
};

/**
 * Send proposal notification email
 */
const sendProposalNotification = async (clientEmail, clientName, gigTitle, freelancerName) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: clientEmail,
    subject: `New proposal received for "${gigTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Proposal Received</h2>
        <p>Hi ${clientName},</p>
        <p><strong>${freelancerName}</strong> has submitted a proposal for your gig <strong>"${gigTitle}"</strong>.</p>
        <a href="${process.env.CLIENT_URL}/dashboard/proposals"
           style="background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin:16px 0;">
          View Proposal
        </a>
      </div>
    `,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendProposalNotification,
};
