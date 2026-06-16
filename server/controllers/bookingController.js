import mongoose from 'mongoose';
import Seat from '../models/Seat.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import { verifyLock, releaseLock } from '../utils/lockManager.js';
import { generateQRCode } from '../utils/qrGenerator.js';
import { getIO } from '../config/socket.js';
import { generateBookingRef } from '../utils/bookingRef.js';

export const confirmBooking = async (req, res) => {
  // Start a MongoDB session for our transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { seatId, eventId } = req.body;
    const userId = req.user.id;

        // verifyLock(eventId, seatId, userId) — lock still exists for this user?
    const hasLock = await verifyLock(eventId, seatId, userId);
    if (!hasLock) {
      await session.abortTransaction();
      return res.status(409).json({ message: 'Lock expired or invalid' });
    }

        // Double-check seat.status in MongoDB (defence in depth)
        const seat = await Seat.findById(seatId);
    if (!seat || seat.status === 'booked') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Seat unavailable' });
    }

    const bookingRef = generateBookingRef();
        
        // Generate QR code
        const qrData = JSON.stringify({ bookingRef, eventId, seatId });
    const qrCode = await generateQRCode(qrData);

        // Booking.create([...], { session }) — insert booking record
        const [booking] = await Booking.create([{ 
          bookingRef, userId, eventId, seatId, seatLabel: seat.label, status: 'confirmed', qrCode 
        }], { session });

        // Seat.findByIdAndUpdate(seatId, { status:'booked' }, { session })
        await Seat.findByIdAndUpdate(seatId, { status: 'booked' }, { session });

        // Event.findByIdAndUpdate(eventId, { $inc:{availableSeats:-1} }, { session })
        await Event.findByIdAndUpdate(eventId, { $inc: { availableSeats: -1 } }, { session });

        // commitTransaction()
    await session.commitTransaction();

        // releaseLock() — delete Redis key
    await releaseLock(eventId, seatId, userId);
        
        // Emit 'seat:booked' to Socket.io room
    getIO().to(`event:${eventId}`).emit('seat:booked', { seatId: seat._id });

        // Return booking object with qrCode base64
        return res.json({ success: true, booking, qrCode });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};