/**
 * Extract filterable battery / EV-spare specs from a product name.
 * Source JSON does not store voltage / Ah / brand as separate keys.
 */

const BRAND_TOKENS = [
  'ATHER',
  'GRAPHY',
  'ICUB',
  'IQUB',
  'IMP',
  'OLA',
  'QT7',
  'STEEL',
  'SUN6',
  'TSV',
  'UALA',
  'ULAA',
  'ULA',
  'LCD',
  'NMC',
  'LFP',
];

const TYPE_PATTERNS = [
  { re: /\blead[\s-]?acid\b/i, value: 'Lead Acid' },
  { re: /\bnmc\b/i, value: 'NMC' },
  { re: /\blfp\b/i, value: 'LFP' },
  { re: /\blithium\b/i, value: 'Lithium' },
];

function uniq(values) {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    const key = String(value || '').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

export function parsePriceInr(raw) {
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.round(raw);
  const digits = String(raw || '').replace(/[^\d.]/g, '');
  const n = Number(digits);
  return Number.isFinite(n) ? Math.round(n * (digits.includes('.') && n < 1000 ? 1 : 1)) : 0;
}

/** Parse ₹ strings like "₹1,198" or "₹479.90" */
export function parseMoney(raw) {
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.round(raw);
  const cleaned = String(raw || '').replace(/[₹,\s]/g, '');
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n);
}

export function extractBatterySpecs(name = '', attributes = []) {
  const text = String(name || '');
  const upper = text.toUpperCase();

  const fromAttrs = {};
  for (const row of attributes || []) {
    for (const option of row?.options || []) {
      const slug = String(option?.slug || '').toLowerCase();
      const value = String(option?.value || '').trim();
      if (!slug || !value) continue;
      if (!fromAttrs[slug]) fromAttrs[slug] = value;
    }
  }

  const voltageMatch = text.match(/(\d+(?:\.\d+)?)\s*v\b/i);
  const currentMatch = text.match(/(\d+(?:\.\d+)?)\s*a\b(?!\s*h)/i);
  const capacityMatch = text.match(/(\d+(?:\.\d+)?)\s*ah\b/i);
  const warrantyMatch = text.match(/(\d+)\s*(?:year|yr|years|yrs)\s*(?:warranty)?/i);

  let batteryType = fromAttrs['battery-type'] || fromAttrs.batterytype || '';
  if (!batteryType) {
    for (const pattern of TYPE_PATTERNS) {
      if (pattern.re.test(text)) {
        batteryType = pattern.value;
        break;
      }
    }
  }

  let brand = fromAttrs.brand || '';
  if (!brand) {
    for (const token of BRAND_TOKENS) {
      if (new RegExp(`\\b${token}\\b`, 'i').test(upper)) {
        brand = token === 'LCD' ? '' : token;
        if (brand) break;
      }
    }
  }

  return {
    voltage: fromAttrs.voltage || (voltageMatch ? `${voltageMatch[1]}V` : ''),
    currentA: fromAttrs['current-a'] || fromAttrs.currenta || (currentMatch ? `${currentMatch[1]}A` : ''),
    capacityAh:
      fromAttrs['capacity-ah'] || fromAttrs.capacityah || (capacityMatch ? `${capacityMatch[1]}Ah` : ''),
    batteryType,
    brand,
    warranty: fromAttrs.warranty || (warrantyMatch ? `${warrantyMatch[1]} Year` : ''),
  };
}

export function specsToAttributeOptions(specs = {}) {
  const map = [
    ['Voltage', 'voltage', specs.voltage],
    ['Current', 'current-a', specs.currentA],
    ['Capacity', 'capacity-ah', specs.capacityAh],
    ['Battery Type', 'battery-type', specs.batteryType],
    ['Brand', 'brand', specs.brand],
    ['Warranty', 'warranty', specs.warranty],
  ];
  return map
    .filter(([, , value]) => value)
    .map(([name, slug, value]) => ({ name, slug, value: String(value) }));
}

export function collectSpecFacets(products = []) {
  const buckets = {
    voltage: [],
    currentA: [],
    capacityAh: [],
    batteryType: [],
    brand: [],
    warranty: [],
  };
  for (const product of products) {
    const specs = product.specs || extractBatterySpecs(product.name, product.attributes);
    for (const key of Object.keys(buckets)) {
      if (specs[key]) buckets[key].push(specs[key]);
    }
  }
  return {
    voltage: uniq(buckets.voltage).sort(),
    currentA: uniq(buckets.currentA).sort((a, b) => parseFloat(a) - parseFloat(b)),
    capacityAh: uniq(buckets.capacityAh).sort((a, b) => parseFloat(a) - parseFloat(b)),
    batteryType: uniq(buckets.batteryType).sort(),
    brand: uniq(buckets.brand).sort(),
    warranty: uniq(buckets.warranty).sort(),
  };
}
