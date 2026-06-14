import express from 'express';
import { lockSeat } from '../controllers/seatController.js';

const router = express.Router();

router.post('/:seatId/lock', lockSeat);

export default router;