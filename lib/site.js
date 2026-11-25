import { BRAND } from '@/lib/brand';

export function isPreviewDeployment() {
  return process.env.VERCEL_ENV === 'preview';
}

export function productionOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      return new URL(configured);
    } catch {
      return null;
    }
  }
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return new URL(`https://${production}`);
  return null;
}

export const HOME_TITLE = BRAND.title;
export const HOME_DESCRIPTION =
  'Shop EV batteries, chargers, controllers, motors and scooter spares at Prime Fast EV. Smart • Clean • Future.';

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (configured) return configured;
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production}`;
  if (process.env.VERCEL_ENV === 'production') {
    const vercel = process.env.VERCEL_URL?.trim();
    if (vercel) return `https://${vercel}`;
  }
  return 'https://primefastev.vercel.app';
}

export function metaDescription(text, fallback = '') {
  const clean = String(text || fallback).replace(/\s+/g, ' ').trim();
  if (!clean) return `${BRAND.name} — ${BRAND.tagline}.`;
  if (clean.length <= 160) return clean;
  return `${clean.slice(0, 157).trim()}...`;
}
