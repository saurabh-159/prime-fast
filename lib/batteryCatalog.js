/**
 * Maps batteries.json (ELYF-style export) into the store's product / category shape.
 * Swap `data/batteries.json` with your full catalog — this normalizer stays the same.
 */

import catalog from '@/data/batteries.json';
import {
  extractBatterySpecs,
  parseMoney,
  specsToAttributeOptions,
} from '@/lib/batteryParse';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function readCategories(raw) {
  if (Array.isArray(raw?.categories)) return raw.categories;
  if (Array.isArray(raw?.sampleObjects)) return raw.sampleObjects;
  if (Array.isArray(raw)) return raw;
  return [];
}

export function loadBatterySource(raw = catalog) {
  return {
    store: raw?.store || 'Prime Fast EV',
    source: raw?.source || '',
    note: raw?.note || '',
    categories: readCategories(raw),
  };
}

export function mapBatteryProduct(raw, category, index) {
  const name = String(raw?.name || 'EV Part').trim();
  const sku = String(raw?.sku || `sku-${index + 1}`).trim();
  const price = parseMoney(raw?.price);
  const specs = extractBatterySpecs(name);
  const options = specsToAttributeOptions(specs);
  const bits = [specs.voltage, specs.currentA, specs.capacityAh, specs.batteryType, specs.brand]
    .filter(Boolean)
    .join(' · ');
  const description =
    bits
      ? `${name}. Specs: ${bits}.`
      : `${name}. EV spare from ${category?.name || 'Prime Fast EV'}.`;

  return {
    id: sku || String(index + 1),
    name,
    sku,
    slug: slugify(name) || slugify(sku) || `product-${index + 1}`,
    price,
    originalPrice: price,
    image: raw?.image || category?.image || '/logo.png',
    images: raw?.image ? [raw.image] : [],
    category: category.slug,
    categoryName: category.name,
    rating: 4.6,
    stock: 25,
    description,
    url: raw?.url || '',
    specs,
    attributes: options.length
      ? [
          {
            sku,
            price,
            options,
          },
        ]
      : [],
  };
}

export function mapBatteryCategory(raw, index) {
  const name = String(raw?.name || `Category ${index + 1}`).trim();
  const slug = String(raw?.slug || slugify(name)).trim();
  const products = Array.isArray(raw?.products) ? raw.products : [];
  const productImage = products.find((item) => item?.image)?.image || '';
  const image = raw?.image || productImage || '/logo.png';
  return {
    id: String(index + 1),
    name,
    slug,
    blurb: name,
    image,
    imageFocus: 'center',
    imageFit: raw?.image || productImage ? 'cover' : 'contain',
    imageBg: '#F8FAFC',
    url: raw?.url || '',
    products,
  };
}

export function buildBatteryCatalog(raw = catalog) {
  const source = loadBatterySource(raw);
  const categories = source.categories.map(mapBatteryCategory);
  const products = [];
  let index = 0;
  for (const category of categories) {
    for (const item of category.products) {
      products.push(mapBatteryProduct(item, category, index));
      index += 1;
    }
  }
  return {
    store: source.store,
    categories: categories.map(({ products: _products, url, ...rest }) => rest),
    products,
  };
}

export const batteryCatalog = buildBatteryCatalog();
