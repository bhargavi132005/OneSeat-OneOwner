import redisClient from '../config/redis.js';

export const startExpireListener = async (io) => {
  try {
    // 1. Tell Redis to publish events when keys Expire ('Ex')
    await redisClient.configSet('notify-keyspace-events', 'Ex');

    // 2. Create a separate subscriber client (node-redis requires a dedicated client for PubSub)
    const subscriber = redisClient.duplicate();
    await subscriber.connect();

    // 3. Listen for expired keys on database 0
    await subscriber.subscribe('__keyevent@0__:expired', (key) => {
      // Our lock keys look like: seat:{eventId}:{seatId}
      if (key.startsWith('seat:')) {
        const parts = key.split(':');
        const eventId = parts[1];
        const seatId = parts[2];

        // 4. Broadcast to the frontend that the seat is available again!
        io.to(`event:${eventId}`).emit('seat:available', { seatId });
        console.log(`[Redis] TTL Expired. Unlocked seat: ${seatId}`);
      }
    });

    console.log('Redis Expiration Listener connected');
  } catch (error) {
    console.error('Error starting Expiration Listener:', error);
  }
};