const Notification = require('../models/Notification.model');

exports.createNotification = async (io, { recipient, type, title, message, link, data }) => {
  const notification = await Notification.create({
    recipient, type, title, message, link, data,
  });

  // Emit real-time notification via Socket.IO
  if (io) {
    io.to(`user_${recipient}`).emit('notification', notification);
  }

  return notification;
};
