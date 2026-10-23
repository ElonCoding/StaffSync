import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './Routes/authRoutes.js';
import employeeRoutes from './Routes/employeeRoutes.js';
import leaveRoutes from './Routes/leaveRoutes.js';
import attendanceRoutes from './Routes/attendanceRoutes.js';
import announcementRoutes from './Routes/announcementRoutes.js';
import trainingRoutes from './Routes/trainingRoutes.js';
import notificationRoutes from './Routes/notificationRoutes.js';
import reportRoutes from './Routes/reportRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(
  cors({
    origin: [CLIENT_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[StaffSync API] ${req.method} ${req.url}`);
  next();
});

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'StaffSync HRMS Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);

// 404 Catch-all for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('[StaffSync Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// Initialize database and start HTTP server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[StaffSync API] Server running on port ${PORT}`);
    console.log(`[StaffSync API] Health check available at http://localhost:${PORT}/api/health`);
  });
}

startServer();

export default app;
