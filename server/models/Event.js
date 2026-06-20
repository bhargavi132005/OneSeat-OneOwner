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
  description: { type: String, required: true },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for 'image' mapping to 'posterUrl'
eventSchema.virtual('image').get(function() {
  return this.posterUrl;
}).set(function(val) {
  this.posterUrl = val;
});

// Virtual for 'place' mapping to 'venue'
eventSchema.virtual('place').get(function() {
  return this.venue;
}).set(function(val) {
  this.venue = val;
});

// Virtual for 'startingPrice' mapping to 'price'
eventSchema.virtual('startingPrice').get(function() {
  return this.price;
}).set(function(val) {
  this.price = val;
});

// Virtual for 'seatsRemaining' mapping to 'availableSeats'
eventSchema.virtual('seatsRemaining').get(function() {
  return this.availableSeats;
}).set(function(val) {
  this.availableSeats = val;
});

export default mongoose.model('Event', eventSchema);
