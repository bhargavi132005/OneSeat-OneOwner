import express from 'express';
import { confirmBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/confirm', protect, apiLimiter, confirmBooking);

export default router;