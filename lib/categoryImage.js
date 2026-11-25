/** True when the category has no real photo (empty or brand logo placeholder). */
export function isPlaceholderImage(src) {
  const value = String(src || '').trim();
  if (!value) return true;
  return value === '/logo.png' || value.endsWith('/logo.png');
}

/** Prefer the category image; otherwise use a product image from that category. */
export function resolveCategoryImage(categoryImage, productImage) {
  if (!isPlaceholderImage(categoryImage)) return String(categoryImage).trim();
  if (!isPlaceholderImage(productImage)) return String(productImage).trim();
  return String(categoryImage || productImage || '/logo.png').trim() || '/logo.png';
}

/** First product image keyed by category id (ObjectId string). */
export function firstImageByCategoryId(products) {
  const map = new Map();
  for (const product of products || []) {
    const categoryId =
      product?.category && typeof product.category === 'object'
        ? String(product.category._id || product.category.id || '')
        : String(product?.category || '');
    if (!categoryId || map.has(categoryId) || isPlaceholderImage(product?.image)) continue;
    map.set(categoryId, String(product.image).trim());
  }
  return map;
}

/** First product image keyed by category slug. */
export function firstImageByCategorySlug(products) {
  const map = new Map();
  for (const product of products || []) {
    const slug =
      product?.category && typeof product.category === 'object'
        ? String(product.category.slug || '')
        : String(product?.category || '');
    if (!slug || map.has(slug) || isPlaceholderImage(product?.image)) continue;
    map.set(slug, String(product.image).trim());
  }
  return map;
}

export function categorySlugFromHref(href) {
  const match = String(href || '').match(/\/categories\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}
