import express from 'express';
import { getMe } from '../controllers/bookingController.js';
import { register, login, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Route to get current user from cookie session
router.get('/me', protect, getMe);

// Apply rate limiting to all authentication routes to prevent brute-force attacks
router.use(apiLimiter);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;