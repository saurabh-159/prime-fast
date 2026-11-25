import 'server-only';
import dns from 'node:dns';
import mongoose from 'mongoose';
import { useStaticData } from '@/lib/dataMode';

dns.setServers(['8.8.8.8', '1.1.1.1']);

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (useStaticData()) {
    throw new Error('Static UI mode is on (no MONGODB_URI). Storefront reads JSON; database APIs are disabled.');
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add it in Vercel Environment Variables (or .env.local for local).');
  }

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).catch((error) => {
      cached.promise = null;
      throw error;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}