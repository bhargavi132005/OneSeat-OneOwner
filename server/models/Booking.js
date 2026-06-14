import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingRef: { type: String, required: true, unique: true }, // e.g., 'SEAT-2X9K4F'
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  seatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seat', required: true },
  seatLabel: { type: String, required: true }, // Denormalized for quick display
  status: { type: String, enum: ['confirmed', 'cancelled'], required: true },
  qrCode: { type: String, required: true } // base64 PNG
}, { 
  timestamps: true 
});

export default mongoose.model('Booking', bookingSchema);
