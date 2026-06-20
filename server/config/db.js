import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Drop the unique index on bookingRef if it exists
    try {
      await conn.connection.db.collection('bookings').dropIndex('bookingRef_1');
      console.log('Successfully dropped unique index bookingRef_1');
    } catch (e) {
      // Index might not exist or already dropped, ignore
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
