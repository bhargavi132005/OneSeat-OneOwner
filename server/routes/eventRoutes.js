import express from 'express';
import { getEvents } from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getEvents);

export default router;