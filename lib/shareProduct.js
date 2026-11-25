import { productPath } from '@/lib/storePath';

export async function shareProduct(product, urlOverride) {
  const path = productPath(product);
  const url = urlOverride || `${window.location.origin}${path}`;
  const name = String(product?.name || '').trim();
  const title = name ? `${name} | Prime Fast EV` : 'Prime Fast EV';
  const text = name ? `${name} on Prime Fast EV` : 'Shop EV batteries & spares at Prime Fast EV';

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (error) {
      if (error?.name === 'AbortError') return 'cancelled';
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'failed';
  }
}
