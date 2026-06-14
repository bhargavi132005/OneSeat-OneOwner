import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Event from '../models/Event.js';
import Seat from '../models/Seat.js';

// Resolve the path to the root .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data to prevent duplicates
    await Event.deleteMany();
    await Seat.deleteMany();
    console.log('Cleared existing events and seats!');

    // 1. Create Events
    const events = [
      {
        title: 'Coldplay - Music of the Spheres',
        venue: 'Wembley Stadium',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        rows: 5,
        seatsPerRow: 10, // 50 seats total
        totalSeats: 50,
        availableSeats: 50,
        price: 5000,
        posterUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop'
      },
      {
        title: 'Ed Sheeran - Mathematics Tour',
        venue: 'The O2 Arena',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        rows: 8,
        seatsPerRow: 12, // 96 seats total
        totalSeats: 96,
        availableSeats: 96,
        price: 4000,
        posterUrl: 'https://images.unsplash.com/photo-1540039155732-d68814a92b0c?q=80&w=1000&auto=format&fit=crop'
      },
      {
        title: 'Taylor Swift - The Eras Tour',
        venue: 'Wembley Stadium',
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        rows: 10,
        seatsPerRow: 15, // 150 seats total
        totalSeats: 150,
        availableSeats: 150,
        price: 8000,
        posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop'
      }
    ];

    const insertedEvents = await Event.insertMany(events);
    console.log(`Inserted ${insertedEvents.length} events!`);

    // 2. Generate Seats for Events
    const seatsToInsert = [];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    insertedEvents.forEach(event => {
      for (let r = 0; r < event.rows; r++) {
        const rowLetter = alphabet[r];
        for (let s = 1; s <= event.seatsPerRow; s++) {
          seatsToInsert.push({
            eventId: event._id,
            label: `${rowLetter}${s}`,
            row: rowLetter,
            number: s,
            status: 'available'
          });
        }
      }
    });

    await Seat.insertMany(seatsToInsert);
    console.log(`Inserted ${seatsToInsert.length} seats!`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDB();