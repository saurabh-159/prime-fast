'use client';

import { useEffect, useState } from 'react';

const FALLBACK = '/logo.png';

/**
 * External catalog photos (esp. Google Drive / lh3) often block hotlinking
 * when a Referer is sent. no-referrer keeps them loading in the browser.
 */
export default function RemoteImg({
  src,
  alt = '',
  className = '',
  fallback = FALLBACK,
  onError,
  ...props
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const current = !src || failed ? fallback : src;

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={(event) => {
        if (!failed && current !== fallback) setFailed(true);
        onError?.(event);
      }}
      {...props}
    />
  );
}
