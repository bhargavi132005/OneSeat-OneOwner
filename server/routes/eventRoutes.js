import express from 'express';
import { getEvents, getEventById, getEventSeats } from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getEvents);
router.get('/:id', protect, getEventById);
router.get('/:id/seats', protect, getEventSeats);

export default router;