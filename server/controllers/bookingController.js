import mongoose from 'mongoose';
import Seat from '../models/Seat.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import { verifyLock, releaseLock } from '../utils/lockManager.js';
import { generateQRCode } from '../utils/qrGenerator.js';
import { getIO } from '../config/socket.js';
import { generateBookingRef } from '../utils/bookingRef.js';

// NOTE: This function should ideally be in `authController.js`.
export const getMe = async (req, res) => {
  try {
    // req.user is attached by the 'protect' middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId })
      .populate({
        path: 'eventId',
        select: 'title venue date startingPrice',
      })
      .sort({ createdAt: -1 });

    // Group multiple seats under the same Booking Reference
    const groupedBookings = bookings.reduce((acc, booking) => {
      if (!acc[booking.bookingRef]) {
        acc[booking.bookingRef] = {
          _id: booking._id,
          bookingRef: booking.bookingRef,
          eventTitle: booking.eventId?.title || 'Event Title',
          venue: booking.eventId?.venue || 'Event Venue',
          eventDate: booking.eventId?.date,
          seats: [],
          totalAmount: 0,
          createdAt: booking.createdAt,
          qrCode: booking.qrCode,
        };
      }
      acc[booking.bookingRef].seats.push(booking.seatLabel);
      acc[booking.bookingRef].totalAmount += (booking.totalAmount || booking.eventId?.startingPrice || 0);
      return acc;
    }, {});

    res.json(Object.values(groupedBookings).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

export const confirmBooking = async (req, res) => {
  // Start a MongoDB session for our transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { seatIds, eventId } = req.body;
    const userId = req.user.id;

    if (!seatIds || seatIds.length === 0 || seatIds.length > 2) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'You can only book 1 or 2 seats at a time' });
    }

    const bookingRef = generateBookingRef();
    const bookingDocs = [];
    const seatLabels = [];

    for (const seatId of seatIds) {
      const hasLock = await verifyLock(eventId, seatId, userId);
      if (!hasLock) {
        await session.abortTransaction();
        return res.status(409).json({ message: 'Lock expired or invalid for a seat' });
      }

      const seat = await Seat.findById(seatId);
      if (!seat || seat.status === 'booked') {
        await session.abortTransaction();
        return res.status(400).json({ message: 'One or more seats are unavailable' });
      }

      seatLabels.push(seat.label);
      
      const qrData = JSON.stringify({ bookingRef, eventId, seatId });
      const qrCode = await generateQRCode(qrData);

      bookingDocs.push({ 
        bookingRef, userId, eventId, seatId, seatLabel: seat.label, status: 'confirmed', qrCode 
      });
    }

    const bookings = await Booking.insertMany(bookingDocs, { session });

    for (const seatId of seatIds) {
      await Seat.findByIdAndUpdate(seatId, { status: 'booked' }, { session });
    }

    await Event.findByIdAndUpdate(eventId, { $inc: { availableSeats: -seatIds.length } }, { session });

    await session.commitTransaction();

    for (const seatId of seatIds) {
      await releaseLock(eventId, seatId, userId);
      getIO().to(`event:${eventId}`).emit('seat:booked', { seatId });
    }

    return res.json({ success: true, booking: bookings[0], seatLabels });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};