import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  venue: { type: String, required: true },
  date: { type: Date, required: true },
  rows: { type: Number, required: true },
  seatsPerRow: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  price: { type: Number, required: true }, // In INR
  posterUrl: { type: String },
}, { 
  timestamps: true 
});

export default mongoose.model('Event', eventSchema);
