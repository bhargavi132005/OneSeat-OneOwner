import Event from '../models/Event.js';
import Seat from '../models/Seat.js';
import redisClient from '../config/redis.js';

export const getEvents = async (req, res) => {
  try {
    // Find all events and sort by date ascending
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventSeats = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const userId = req.user.id;

    const seats = await Seat.find({ eventId }).lean();
    
    const seatsWithStatus = await Promise.all(
      seats.map(async (seat) => {
        if (seat.status === 'booked') return { ...seat, status: 'booked' };

        const lockVal = await redisClient.get(`seat:${eventId}:${seat._id}`);
        if (lockVal) {
          return {
            ...seat,
            status: 'locked',
            lockedByMe: lockVal === userId // Highlight user's own lock
          };
        }
        return { ...seat, status: 'available' };
      })
    );

    res.json(seatsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};