import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import seatRoutes from './routes/seatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import { startExpireListener } from './services/expireListener.js';

// Load environment variables from the parent directory
dotenv.config({ path: '../.env' });

const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Socket.io Setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Make io accessible in controllers
app.set('io', io);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);

// Initialize Databases and Start Server
const startServer = async () => {
  await connectDB();
  await connectRedis();
  
  // Start Redis Expiration Listener
  await startExpireListener(io);

  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
