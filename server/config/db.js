import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/staffsync';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[StaffSync DB] MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[StaffSync DB] MongoDB connection not available at ${uri}: ${error.message}`);
    console.warn(`[StaffSync DB] Server will operate with persistent mock/memory storage fallback.`);
    return false;
  }
}
