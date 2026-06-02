const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Track online users: userId -> socketId
const onlineUsers = new Map();

const initSocket = (io) => {
  // Auth middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    console.log(`🟢 User connected: ${socket.user.name} [${socket.id}]`);

    // Track online status
    onlineUsers.set(userId, socket.id);
    io.emit('user:online', { userId, online: true });

    // Join personal room for notifications
    socket.join(`user:${userId}`);

    // ── MESSAGING ──────────────────────────────────────────────
    socket.on('message:send', async (data) => {
      const { conversationId, receiverId, content, fileUrl } = data;
      // Emit to receiver's personal room
      io.to(`user:${receiverId}`).emit('message:receive', {
        conversationId,
        senderId: userId,
        content,
        fileUrl,
        createdAt: new Date(),
      });
    });

    socket.on('message:typing', ({ conversationId, receiverId }) => {
      io.to(`user:${receiverId}`).emit('message:typing', {
        conversationId,
        userId,
      });
    });

    socket.on('message:stop_typing', ({ conversationId, receiverId }) => {
      io.to(`user:${receiverId}`).emit('message:stop_typing', {
        conversationId,
        userId,
      });
    });

    socket.on('message:read', ({ conversationId, senderId }) => {
      io.to(`user:${senderId}`).emit('message:read', { conversationId });
    });

    // ── NOTIFICATIONS ───────────────────────────────────────────
    socket.on('notification:read', ({ notificationId }) => {
      // Handled by REST API, broadcast back for multi-device sync
      socket.to(`user:${userId}`).emit('notification:read', { notificationId });
    });

    // ── DISCONNECT ──────────────────────────────────────────────
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('user:online', { userId, online: false });
      console.log(`🔴 User disconnected: ${socket.user.name}`);
    });
  });
};

// Helper: send notification via socket to a user
const sendSocketNotification = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification:new', notification);
};

module.exports = { initSocket, sendSocketNotification, onlineUsers };
