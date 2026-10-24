import dns from 'node:dns';
import mongoose from 'mongoose';

// Node.js on Windows sometimes fails SRV lookup using local ISP DNS.
// Set reliable public DNS (Google 8.8.8.8, Cloudflare 1.1.1.1) for node:dns
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  console.warn('[StaffSync DNS] Could not override DNS servers:', e.message);
}

// Keep bufferCommands enabled so queries queue until connection establishes,
// with 10s server selection timeout
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[StaffSync DB] MONGODB_URI missing in .env');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      family: 4, // force IPv4
    });
    console.log(`[StaffSync DB] MongoDB Atlas CONNECTED: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[StaffSync DB] MongoDB connection FAILED: ${error.message}`);
    return false;
  }
}
