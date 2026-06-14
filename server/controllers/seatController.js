import Seat from '../models/Seat.js';
import { acquireLock } from '../services/lockManager.js';

export const lockSeat = async (req, res) => {
  try {
    const { seatId } = req.params;
    const { userId } = req.body; // TODO: Replace with req.user.id once Auth is built

    if (!userId) {
      return res.status(400).json({ message: 'userId is required for testing' });
    }

    // 1. Seat exists & not 'booked'? (MongoDB check)
    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ message: 'Seat not found' });
    if (seat.status === 'booked') return res.status(400).json({ message: 'Seat already booked' });

    // 2. Redis Lua Script (ATOMIC — no race window)
    const lockResult = await acquireLock(seat.eventId.toString(), seatId, userId);

    if (lockResult === 'LOCKED_BY_OTHER') {
      return res.status(409).json({ message: 'LOCKED_BY_OTHER' });
    }
    if (lockResult === 'LOCK_LIMIT_REACHED') {
      return res.status(429).json({ message: 'LOCK_LIMIT_REACHED' });
    }

    // 3. Socket.io broadcast to room event:{eventId}
    const io = req.app.get('io');
    io.to(`event:${seat.eventId}`).emit('seat:locked', { seatId: seat._id, label: seat.label });

    // 4. Response: { success: true, expiresAt }
    const expiresAt = new Date(Date.now() + 300 * 1000); // 5 mins from now
    return res.json({ success: true, expiresAt });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};