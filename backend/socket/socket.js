const jwt = require('jsonwebtoken');

const onlineUsers = new Map();

exports.initSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    socket.join(`user_${userId}`);
    onlineUsers.set(userId, socket.id);
    io.emit('user_online', { userId });

    socket.on('typing_start', ({ toUserId }) => {
      io.to(`user_${toUserId}`).emit('typing_start', { fromUserId: userId });
    });
    socket.on('typing_stop', ({ toUserId }) => {
      io.to(`user_${toUserId}`).emit('typing_stop', { fromUserId: userId });
    });
    socket.on('join_gig', (gigId) => socket.join(`gig_${gigId}`));
    socket.on('leave_gig', (gigId) => socket.leave(`gig_${gigId}`));
    socket.on('gig_update', ({ gigId, data }) => socket.to(`gig_${gigId}`).emit('gig_update', data));
    socket.on('message_read', ({ messageId, toUserId }) => io.to(`user_${toUserId}`).emit('message_read', { messageId }));
    socket.on('get_online_users', () => socket.emit('online_users', Array.from(onlineUsers.keys())));

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('user_offline', { userId });
    });
  });
};

exports.getOnlineUsers = () => Array.from(onlineUsers.keys());
