import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

dotenv.config();

// Ensure reliable SRV DNS resolution for MongoDB Atlas on Windows/Node
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  // Ignore if custom DNS cannot be set
}

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expiryguard';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoUri}: ${error.message}`);
    console.log('[Notice] Set MONGO_URI in server/.env or check network connectivity.');
  }
};

export default connectDB;

