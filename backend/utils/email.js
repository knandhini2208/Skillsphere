const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
};

exports.sendVerificationEmail = async (user, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify Your SkillSphere Account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#1a56db;">Welcome to SkillSphere!</h2>
        <p>Hi ${user.name}, please verify your email to get started.</p>
        <a href="${url}" style="background:#1a56db;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin:16px 0;">
          Verify Email
        </a>
        <p>Link expires in 24 hours.</p>
      </div>
    `,
  });
};

exports.sendPasswordResetEmail = async (user, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset Your SkillSphere Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#1a56db;">Password Reset Request</h2>
        <p>Hi ${user.name}, click below to reset your password.</p>
        <a href="${url}" style="background:#e74c3c;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin:16px 0;">
          Reset Password
        </a>
        <p>Link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

exports.sendNotificationEmail = async (user, subject, message) => {
  await sendEmail({ to: user.email, subject, html: `<p>${message}</p>` });
};
