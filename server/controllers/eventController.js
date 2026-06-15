import Event from '../models/Event.js';

export const getEvents = async (req, res) => {
  try {
    // The 'protect' middleware has already verified the user.
    // We can now safely fetch data.
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};