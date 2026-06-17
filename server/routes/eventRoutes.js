import express from 'express';
import { getEvents, getEventById, getEventSeats } from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Events should be publicly accessible
router.get('/', getEvents);
router.get('/:id', getEventById);
router.get('/:id/seats', getEventSeats);

export default router;