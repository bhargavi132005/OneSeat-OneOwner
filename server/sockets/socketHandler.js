import { verifyAccess } from '../utils/jwt.js';
import { setIO } from '../config/socket.js';

export const initializeSocket = (io) => {
  // Set the singleton instance
  setIO(io);

  // io.use() middleware — verify JWT from handshake
  io.use((socket, next) => {
    try {
      // Extract token from HttpOnly cookies sent via withCredentials
      const cookies = socket.handshake.headers.cookie;
      const token = cookies
        ? cookies.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1]
        : socket.handshake.auth?.token; // Fallback

      if (!token) return next(new Error('Authentication error: No token provided'));

      const decoded = verifyAccess(token);
      socket.userId = decoded.userId; // attach socket.userId
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (User: ${socket.userId})`);

    socket.on('join:event', ({ eventId }) => {
      socket.join(`event:${eventId}`);
    });

    socket.on('leave:event', ({ eventId }) => {
      socket.leave(`event:${eventId}`);
    });

    socket.on('disconnect', () => {
      // disconnect — LOG only, do NOT release locks (TTL handles expiry)
      console.log(`Socket disconnected: ${socket.id} (User: ${socket.userId})`);
    });
  });
};