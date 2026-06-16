import Seat from '../models/Seat.js';
import { acquireLock } from '../utils/lockManager.js';
import { getIO } from '../config/socket.js';

export const lockSeat = async (req, res) => {
  try {
    const { seatId } = req.params;
    const { eventId } = req.body;
    const userId = req.user.id;

    // Verify seat exists and belongs to the event (prevent seat hijacking)
    const seat = await Seat.findById(seatId);
    if (!seat || seat.eventId.toString() !== eventId) {
      return res.status(404).json({ message: 'Seat not found or event mismatch' });
    }

    // Check seat.status !== 'booked' in MongoDB
    if (seat.status === 'booked') {
      return res.status(400).json({ message: 'Seat is permanently booked' });
    }

    // Call acquireLock() from lockManager.js
    const lockResult = await acquireLock(eventId, seatId, userId);

    // Map results: LOCKED_BY_OTHER -> 409, LOCK_LIMIT_REACHED -> 429, SUCCESS -> 200
    if (lockResult === 'LOCKED_BY_OTHER') {
      return res.status(409).json({ message: 'Seat is locked by another user' });
    }
    if (lockResult === 'LOCK_LIMIT_REACHED') {
      return res.status(429).json({ message: 'You have reached the maximum allowed locks' });
    }

    // Emit 'seat:locked' to Socket.io room event:{eventId}
    getIO().to(`event:${eventId}`).emit('seat:locked', { seatId, lockedBy: userId });

    // Return { success: true, expiresAt, seatLabel }
    const expiresAt = new Date(Date.now() + 120 * 1000); // Standard 120 seconds
    return res.status(200).json({ success: true, expiresAt, seatLabel: seat.label });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};