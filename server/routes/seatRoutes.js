import express from 'express';
import { lockSeat, releaseSeat } from '../controllers/seatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/:seatId/lock', protect, lockSeat);
router.post('/:seatId/release', protect, releaseSeat);

export default router;