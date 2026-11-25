const RESERVED = new Set(['search', 'sort', 'category', 'min', 'max', 'stock', 'sale', 'page']);

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
];

export const PRICE_RANGES = [
  { id: 'under-500', label: '₹500 & under', min: null, max: 500 },
  { id: '500-1000', label: '₹501 – ₹1,000', min: 501, max: 1000 },
  { id: '1000-2500', label: '₹1,001 – ₹2,500', min: 1001, max: 2500 },
  { id: 'over-2500', label: 'Over ₹2,500', min: 2501, max: null },
];

export const SORT_MAP = {
  newest: { createdAt: -1 },
  featured: { featured: -1, createdAt: -1 },
  'price-asc': { price: 1, createdAt: -1 },
  'price-desc': { price: -1, createdAt: -1 },
  rating: { rating: -1, numReviews: -1, createdAt: -1 },
};

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function readNumber(value) {
  if (value == null || String(value).trim() === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 10000000) return null;
  return Math.round(n);
}

function readList(searchParams, key) {
  const raw = searchParams?.[key];
  const parts = Array.isArray(raw) ? raw : raw != null && raw !== '' ? [raw] : [];
  const values = [];
  for (const part of parts) {
    for (const bit of String(part).split(',')) {
      const value = bit.trim();
      if (!value || value.length > 40 || values.includes(value)) continue;
      values.push(value);
      if (values.length >= 12) return values;
    }
  }
  return values;
}

export function parseListingFilters(searchParams = {}) {
  const sp = searchParams || {};
  const sortRaw = String(first(sp.sort) || '').trim();
  const sort = SORT_MAP[sortRaw] ? sortRaw : 'newest';
  let min = readNumber(first(sp.min));
  let max = readNumber(first(sp.max));
  if (min != null && max != null && min > max) {
    const swap = min;
    min = max;
    max = swap;
  }
  const attrs = {};
  for (const key of Object.keys(sp)) {
    const slug = key.toLowerCase();
    if (RESERVED.has(slug) || !/^[a-z0-9-]{1,32}$/.test(slug)) continue;
    const values = readList(sp, key);
    if (values.length) attrs[slug] = values;
  }
  return {
    search: String(first(sp.search) || '').trim().slice(0, 80),
    sort,
    categories: readList(sp, 'category')
      .map((slug) => slug.toLowerCase())
      .filter((slug) => /^[a-z0-9-]+$/.test(slug)),
    min,
    max,
    inStock: String(first(sp.stock) || '') === '1',
    onSale: String(first(sp.sale) || '') === '1',
    attrs,
  };
}

export function listingHref(pathname, filters, page = 1) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort);
  if (filters.categories?.length) params.set('category', filters.categories.join(','));
  if (filters.min != null) params.set('min', String(filters.min));
  if (filters.max != null) params.set('max', String(filters.max));
  if (filters.inStock) params.set('stock', '1');
  if (filters.onSale) params.set('sale', '1');
  for (const [slug, values] of Object.entries(filters.attrs || {})) {
    if (values?.length) params.set(slug, values.join(','));
  }
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function clearedFilters(filters) {
  return {
    search: filters.search || '',
    sort: 'newest',
    categories: [],
    min: null,
    max: null,
    inStock: false,
    onSale: false,
    attrs: {},
  };
}

export function activeFilterCount(filters) {
  let count = filters.categories?.length || 0;
  if (filters.min != null || filters.max != null) count += 1;
  if (filters.inStock) count += 1;
  if (filters.onSale) count += 1;
  if (filters.sort && filters.sort !== 'newest') count += 1;
  for (const values of Object.values(filters.attrs || {})) count += values.length;
  return count;
}

export function priceBounds(min, max) {
  const price = {};
  if (min != null) price.$gte = min;
  if (max != null) price.$lte = max;
  return price;
}

export function moneyLabel(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

export function priceSelectionLabel(min, max) {
  const range = PRICE_RANGES.find((item) => item.min === min && item.max === max);
  if (range) return range.label;
  if (min != null && max != null) return `${moneyLabel(min)} – ${moneyLabel(max)}`;
  if (min != null) return `${moneyLabel(min)} & above`;
  if (max != null) return `${moneyLabel(max)} & under`;
  return '';
}
