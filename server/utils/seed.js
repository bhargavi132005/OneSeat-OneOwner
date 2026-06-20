import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Event from '../models/Event.js';
import Seat from '../models/Seat.js';
import Booking from '../models/Booking.js';

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
    await Booking.deleteMany();
    console.log('Cleared existing events, seats, and bookings!');

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
        posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop',
        description: 'Experience the magic of Coldplay\'s Music of the Spheres World Tour live at Wembley Stadium. Featuring spectacular lights, laser shows, and their greatest hits, this concert is designed to be a fully immersive sensory experience. Sing along to anthems like "Yellow", "Fix You", and "Viva La Vida" under a sky filled with biodegradable confetti and glowing LED wristbands. Join thousands of fans for an unforgettable evening of joy, music, and sustainability.'
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
        posterUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop',
        description: 'Join Ed Sheeran for his record-breaking Mathematics (+-=÷x) Tour at The O2 Arena. Watch him perform from a stunning 360-degree revolving stage surrounded by giant guitar picks and screens. Using his signature loop station, Ed will build every track completely live right before your eyes. Enjoy a spectacular setlist featuring brand new tracks alongside fan favorites like "Shape of You", "Perfect", and "Thinking Out Loud".'
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
        posterUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
        description: 'Witness the legendary Eras Tour by Taylor Swift at Wembley Stadium. This three-hour-plus musical masterpiece is a chronological journey celebrating all of her iconic musical eras. Complete with theatrical sets, dozens of gorgeous costume changes, and top-tier dancers, it is the highest-grossing concert tour of all time. Secure your seats to witness this historic pop-culture phenomenon live.'
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