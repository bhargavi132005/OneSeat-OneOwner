import express from 'express';
import { confirmBooking, getMyBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Route to get all bookings for the logged-in user
router.get('/my', protect, getMyBookings);

router.post('/confirm', protect, apiLimiter, confirmBooking);

export default router;