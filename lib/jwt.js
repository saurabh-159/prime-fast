import { SignJWT, jwtVerify } from 'jose';

function getExpires() {
  return process.env.JWT_EXPIRES_IN || '7d';
}

function getKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function signToken(payload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(getExpires())
    .sign(getKey());
}

export async function verifyToken(token) {
  try {
    if (!process.env.JWT_SECRET) return null;
    const { payload } = await jwtVerify(token, getKey());
    return payload;
  } catch {
    return null;
  }
}
