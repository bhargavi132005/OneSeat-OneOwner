import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting to all authentication routes to prevent brute-force attacks
router.use(apiLimiter);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;