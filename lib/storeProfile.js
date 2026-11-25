import { connection } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StoreProfile from '@/models/StoreProfile';
import { STORE_DEFAULTS, shapeStoreProfile } from '@/lib/storeProfileInput';
import { useStaticData } from '@/lib/dataMode';

export async function ensureStoreProfile() {
  await connectDB();
  await StoreProfile.updateOne({ key: 'store' }, { $setOnInsert: STORE_DEFAULTS }, { upsert: true });
  return StoreProfile.findOne({ key: 'store' });
}

export async function readStoreProfileRecord() {
  if (useStaticData()) return shapeStoreProfile(STORE_DEFAULTS);
  const doc = await ensureStoreProfile();
  return shapeStoreProfile(doc);
}

export async function saveStoreProfile(input) {
  await connectDB();
  const doc = await StoreProfile.findOneAndUpdate(
    { key: 'store' },
    { $set: { ...input, key: 'store' } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  return shapeStoreProfile(doc);
}

export async function getStoreProfile() {
  if (useStaticData()) return shapeStoreProfile(STORE_DEFAULTS);
  try {
    await connection();
    const doc = await ensureStoreProfile();
    return shapeStoreProfile(doc);
  } catch {
    return shapeStoreProfile(STORE_DEFAULTS);
  }
}
