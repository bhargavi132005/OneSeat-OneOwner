import express from 'express';
import { confirmBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/confirm', protect, confirmBooking);

export default router;