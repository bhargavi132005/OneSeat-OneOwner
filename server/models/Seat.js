import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  label: { type: String, required: true }, // e.g., 'A1'
  row: { type: String, required: true },   // e.g., 'A'
  number: { type: Number, required: true }, // e.g., 1
  status: { type: String, enum: ['available', 'booked'], default: 'available', required: true }
  // NOTE: 'locked' status is handled via Redis, not MongoDB
});

// Compound index to ensure seat labels are unique per event
seatSchema.index({ eventId: 1, label: 1 }, { unique: true });

export default mongoose.model('Seat', seatSchema);
