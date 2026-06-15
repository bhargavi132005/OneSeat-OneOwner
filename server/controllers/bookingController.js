import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import Seat from '../models/Seat.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import { verifyLock, releaseLock } from '../services/lockManager.js';

export const confirmBooking = async (req, res) => {
  // Start a MongoDB session for our transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { seatId, eventId } = req.body;
    const userId = req.user.id;

    // 1. Verify Redis Lock still exists for this user
    const hasLock = await verifyLock(eventId, seatId, userId);
    if (!hasLock) {
      await session.abortTransaction();
      return res.status(409).json({ message: 'Lock expired or invalid' });
    }

    // 2. Fetch Seat and Event
    const seat = await Seat.findById(seatId).session(session);
    if (!seat || seat.status === 'booked') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Seat unavailable' });
    }
    const event = await Event.findById(eventId).session(session);

    // 3. Update Database (Seat & Event)
    seat.status = 'booked';
    await seat.save({ session });

    event.availableSeats -= 1;
    await event.save({ session });

    // 4. Generate Booking Ref & QR Code
    const bookingRef = `SEAT-${nanoid(6).toUpperCase()}`;
    const qrData = JSON.stringify({ bookingRef, seatLabel: seat.label, event: event.title });
    const qrCode = await QRCode.toDataURL(qrData);

    // 5. Create Booking Record
    const booking = new Booking({ bookingRef, userId, eventId, seatId, seatLabel: seat.label, status: 'confirmed', qrCode });
    await booking.save({ session });

    // 6. Commit Transaction
    await session.commitTransaction();

    // 7. Clean up Redis Lock & Broadcast success
    await releaseLock(eventId, seatId, userId);
    const io = req.app.get('io');
    io.to(`event:${eventId}`).emit('seat:booked', { seatId: seat._id });

    return res.json({ success: true, booking });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};