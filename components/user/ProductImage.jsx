'use client';

import Image from 'next/image';
import RemoteImg from '@/components/ui/RemoteImg';

function needsDirectLoad(src) {
  const value = String(src || '');
  return (
    value.includes('lh3.googleusercontent.com') ||
    value.includes('drive.google.com') ||
    value.includes('googleusercontent.com')
  );
}

export default function ProductImage({ src, alt, className = '', sizes, priority = false }) {
  if (!src) {
    return <span className={`block h-full w-full bg-[#F8FAFC] ${className}`} role="img" aria-label={alt} />;
  }

  // Google Drive host blocks/ slows Next image optimization from some networks.
  // Load those directly with no-referrer so cards render reliably.
  if (needsDirectLoad(src)) {
    return (
      <RemoteImg
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes || '(max-width: 768px) 50vw, 25vw'}
      priority={priority}
      className={className}
      referrerPolicy="no-referrer"
    />
  );
}
