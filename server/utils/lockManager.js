import redisClient from '../config/redis.js';

// Lua Script for Atomic Lock Acquisition
const ACQUIRE_LOCK_SCRIPT = `
  local lockKey  = KEYS[1]   -- seat:{eventId}:{seatId}
  local userKey  = KEYS[2]   -- userlocks:{userId}
  local userId   = ARGV[1]
  local ttl      = tonumber(ARGV[2])   -- 300
  local maxLocks = tonumber(ARGV[3])   -- 2

  -- Step 1: Is seat already locked by someone else?
  local existing = redis.call('GET', lockKey)
  if existing and existing ~= userId then
    return 'LOCKED_BY_OTHER'
  end

  -- Step 2: Has user hit the lock limit?
  local count = tonumber(redis.call('GET', userKey) or '0')
  
  -- Only check limits and increment if this is a NEW lock
  if not existing then
    if count >= maxLocks then
      return 'LOCK_LIMIT_REACHED'
    end
    redis.call('SET', userKey, count + 1, 'EX', ttl)
  else
    -- If re-locking, just refresh the user lock TTL
    redis.call('EXPIRE', userKey, ttl)
  end

  -- Step 3: Atomic acquire/refresh
  redis.call('SET', lockKey, userId, 'EX', ttl)
  return 'SUCCESS'
`;

// Lua Script for Atomic Lock Release
const RELEASE_LOCK_SCRIPT = `
  if redis.call('GET', KEYS[1]) == ARGV[1] then
    redis.call('DEL', KEYS[1])
    local count = tonumber(redis.call('GET', KEYS[2]) or '0')
    if count > 0 then
      redis.call('DECR', KEYS[2])
    end
    return 1
  end
  return 0
`;

export const acquireLock = async (eventId, seatId, userId, ttl = 300, maxLocks = 2) => {
  return await redisClient.eval(ACQUIRE_LOCK_SCRIPT, {
    keys: [`seat:${eventId}:${seatId}`, `userlocks:${eventId}:${userId}`],
    arguments: [userId, ttl.toString(), maxLocks.toString()]
  });
};

export const verifyLock = async (eventId, seatId, userId) => {
  const owner = await redisClient.get(`seat:${eventId}:${seatId}`);
  return owner === userId;
};

export const releaseLock = async (eventId, seatId, userId) => {
  const result = await redisClient.eval(RELEASE_LOCK_SCRIPT, {
    keys: [`seat:${eventId}:${seatId}`, `userlocks:${eventId}:${userId}`],
    arguments: [userId]
  });
  return result === 1;
};
