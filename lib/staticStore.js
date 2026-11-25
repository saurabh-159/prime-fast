import 'server-only';
import { batteryCatalog } from '@/lib/batteryCatalog';
import uiContent from '@/data/ui-content.json';
import { PRICE_RANGES } from '@/lib/listingQuery';
import { storePath } from '@/lib/storePath';
import {
  categorySlugFromHref,
  firstImageByCategorySlug,
  isPlaceholderImage,
  resolveCategoryImage,
} from '@/lib/categoryImage';

const SIZE_ORDER = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', 'free size'];
const GROUP_ORDER = [
  'voltage',
  'current-a',
  'capacity-ah',
  'battery-type',
  'brand',
  'warranty',
  'size',
  'color',
  'colour',
  'fabric',
];

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function withFlags(products) {
  return products.map((product, index) => {
    const sale = index % 3 === 0 && product.price > 0;
    const originalPrice = sale ? Math.round(product.price * 1.18) : product.originalPrice || product.price;
    return {
      ...product,
      numReviews: product.numReviews ?? 0,
      featured: index < 8,
      bestSeller: index >= 4 && index < 16,
      originalPrice,
    };
  });
}

const PRODUCTS = withFlags(batteryCatalog.products);
const CATEGORIES = batteryCatalog.categories.map((category) => {
  const count = PRODUCTS.filter((product) => product.category === category.slug).length;
  const productImage = PRODUCTS.find((product) => product.category === category.slug && !isPlaceholderImage(product.image))
    ?.image;
  const usedProductImage = !isPlaceholderImage(productImage);
  const image = usedProductImage
    ? String(productImage).trim()
    : resolveCategoryImage(category.image, productImage);
  return {
    ...category,
    image,
    imageFit: usedProductImage ? 'cover' : category.imageFit || '',
    count,
  };
});

function sortFacetOptions(slug, options) {
  const copy = [...options];
  if (slug !== 'size') {
    copy.sort((a, b) => a.value.localeCompare(b.value));
    return copy;
  }
  copy.sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a.value.toLowerCase());
    const bi = SIZE_ORDER.indexOf(b.value.toLowerCase());
    if (ai === -1 && bi === -1) return a.value.localeCompare(b.value);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
  return copy;
}

function matchesAttrs(product, attrs) {
  const entries = Object.entries(attrs || {}).filter(([, values]) => values?.length);
  if (!entries.length) return true;
  return entries.every(([slug, values]) => {
    const wanted = new Set(values.map((value) => String(value).toLowerCase()));
    return (product.attributes || []).some((row) =>
      (row.options || []).some(
        (option) =>
          String(option.slug || '').toLowerCase() === String(slug).toLowerCase() &&
          wanted.has(String(option.value || '').toLowerCase()),
      ),
    );
  });
}

function filterProducts({ categorySlug = '', filters = {} } = {}) {
  let rows = PRODUCTS;
  if (categorySlug) {
    rows = rows.filter((product) => product.category === categorySlug);
  } else if (filters.categories?.length) {
    const set = new Set(filters.categories);
    rows = rows.filter((product) => set.has(product.category));
  }
  const term = String(filters.search || '').trim();
  if (term) {
    const re = new RegExp(escapeRegex(term), 'i');
    rows = rows.filter((product) => re.test(product.name || ''));
  }
  if (filters.min != null) rows = rows.filter((product) => product.price >= filters.min);
  if (filters.max != null) rows = rows.filter((product) => product.price <= filters.max);
  if (filters.inStock) rows = rows.filter((product) => product.stock > 0);
  if (filters.onSale) rows = rows.filter((product) => product.originalPrice > product.price);
  rows = rows.filter((product) => matchesAttrs(product, filters.attrs));
  return rows;
}

function sortProducts(rows, sort) {
  const copy = [...rows];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'rating':
      return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'featured':
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured));
    default:
      return copy;
  }
}

function paginate(rows, page = 1, limit = 12) {
  const safeLimit = Math.min(48, Math.max(1, Number(limit) || 12));
  const total = rows.length;
  const pages = total ? Math.ceil(total / safeLimit) : 0;
  const requested = Number.parseInt(String(page || '1'), 10);
  const safePage = pages ? Math.min(Math.max(1, Number.isFinite(requested) ? requested : 1), pages) : 1;
  return {
    products: rows.slice((safePage - 1) * safeLimit, safePage * safeLimit),
    total,
    page: safePage,
    pages,
  };
}

function shapeBanner(banner) {
  return {
    id: banner.id || banner.title || 'banner',
    placement: banner.placement,
    title: banner.title || '',
    subtitle: banner.subtitle || '',
    badge: banner.badge || '',
    href: storePath(banner.href),
    cta: banner.cta || '',
    code: banner.code || '',
    image: banner.image || '',
    hoverImage: banner.hoverImage || '',
    imageAlt: banner.imageAlt || banner.title || '',
    accent: Boolean(banner.accent),
    endsAt: banner.endsAt || null,
    order: banner.order || 0,
    active: banner.active !== false,
  };
}

function shapeHomeProduct(product) {
  return {
    id: product.id,
    slug: product.slug || '',
    name: product.name,
    image: product.image || '',
    price: Number(product.price || 0),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    stock: product.stock ?? 0,
    category: product.category || '',
    categoryName: product.categoryName || '',
    featured: Boolean(product.featured),
    bestSeller: Boolean(product.bestSeller),
    specs: product.specs || {},
  };
}

export function staticGetProductById(id) {
  return PRODUCTS.find((product) => product.id === String(id)) || null;
}

export function staticResolveProductPath(param) {
  const key = String(param || '').trim();
  if (!key) return null;
  const bySlug = PRODUCTS.find((product) => product.slug === key);
  if (bySlug) return { product: bySlug };
  const byId = PRODUCTS.find((product) => product.id === key);
  if (!byId) return null;
  if (byId.slug) return { redirect: `/products/${byId.slug}` };
  return { product: byId };
}

export function staticGetRelatedProducts(product) {
  if (!product?.id || !product.category) return [];
  return PRODUCTS.filter((row) => row.category === product.category && row.id !== product.id).slice(0, 4);
}

export function staticListProducts(page = 1, limit = 12, search = '') {
  return paginate(filterProducts({ filters: { search } }), page, limit);
}

export function staticListFilteredProducts({ page = 1, limit = 12, categorySlug = '', filters }) {
  if (categorySlug && !CATEGORIES.some((category) => category.slug === categorySlug)) return null;
  if (!categorySlug && filters?.categories?.length) {
    const hit = CATEGORIES.some((category) => filters.categories.includes(category.slug));
    if (!hit) return { products: [], total: 0, page: 1, pages: 0 };
  }
  const rows = sortProducts(filterProducts({ categorySlug, filters }), filters?.sort);
  return paginate(rows, page, limit);
}

export function staticGetListingFacets({ categorySlug = '', search = '' } = {}) {
  if (categorySlug && !CATEGORIES.some((category) => category.slug === categorySlug)) return null;
  const rows = filterProducts({ categorySlug, filters: { search } });
  const rangeCounts = PRICE_RANGES.map((range) =>
    rows.filter((product) => {
      if (range.min != null && product.price < range.min) return false;
      if (range.max != null && product.price > range.max) return false;
      return true;
    }).length,
  );
  const groups = new Map();
  for (const product of rows) {
    for (const row of product.attributes || []) {
      for (const option of row.options || []) {
        const slug = String(option.slug || '').trim().toLowerCase();
        const value = String(option.value || '').trim();
        if (!slug || !value) continue;
        if (!groups.has(slug)) groups.set(slug, { slug, name: option.name || slug, options: [] });
        const group = groups.get(slug);
        const existing = group.options.find((item) => item.value === value);
        if (existing) existing.count += 1;
        else group.options.push({ value, count: 1 });
      }
    }
  }
  const attributes = [...groups.values()]
    .map((group) => ({ ...group, options: sortFacetOptions(group.slug, group.options) }))
    .filter((group) => group.options.length)
    .sort((a, b) => {
      const ai = GROUP_ORDER.indexOf(a.slug);
      const bi = GROUP_ORDER.indexOf(b.slug);
      if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  let categories = [];
  if (!categorySlug) {
    const counts = new Map();
    for (const product of rows) {
      counts.set(product.category, (counts.get(product.category) || 0) + 1);
    }
    categories = CATEGORIES.filter((category) => counts.has(category.slug))
      .map((category) => ({
        slug: category.slug,
        name: category.name,
        count: counts.get(category.slug) || 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return {
    categories,
    priceRanges: PRICE_RANGES.map((range, index) => ({ ...range, count: rangeCounts[index] })).filter(
      (range) => range.count > 0,
    ),
    inStock: rows.filter((product) => product.stock > 0).length,
    onSale: rows.filter((product) => product.originalPrice > product.price).length,
    attributes,
  };
}

export function staticListCategories() {
  return CATEGORIES.map((category) => ({ ...category }));
}

export function staticGetCategoryView(slug) {
  const key = String(slug || '').trim();
  const category = CATEGORIES.find((item) => item.slug === key);
  if (!category) return null;
  const products = PRODUCTS.filter((product) => product.category === key);
  const others = CATEGORIES.filter((item) => item.slug !== key).slice(0, 4);
  return { category: { ...category }, products, others };
}

export function staticListSitemapEntries() {
  return {
    products: PRODUCTS.filter((product) => product.slug).map((product) => ({
      slug: product.slug,
      updatedAt: null,
    })),
    categories: CATEGORIES.filter((category) => category.slug).map((category) => ({
      slug: category.slug,
      updatedAt: null,
    })),
  };
}

export function staticGetHomeContent() {
  const shapedProducts = PRODUCTS.map(shapeHomeProduct);
  const productImageBySlug = firstImageByCategorySlug(shapedProducts);
  const shapedCategories = CATEGORIES.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    blurb: category.blurb || '',
    image: category.image,
    imageFocus: category.imageFocus || 'center',
    imageFit: category.imageFit || '',
    imageBg: category.imageBg || '',
    count: category.count || 0,
  }))
    .filter((category) => category.count > 0 && !isPlaceholderImage(category.image))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const imageByCategorySlug = new Map();
  for (const category of CATEGORIES) {
    if (!isPlaceholderImage(category.image)) imageByCategorySlug.set(category.slug, category.image);
    const fromProduct = productImageBySlug.get(category.slug);
    if (!isPlaceholderImage(fromProduct)) imageByCategorySlug.set(category.slug, fromProduct);
  }

  function withResolvedBannerImage(banner) {
    const shaped = shapeBanner(banner);
    const slug = categorySlugFromHref(shaped.href);
    if (isPlaceholderImage(shaped.image)) {
      const fromCategory = slug ? imageByCategorySlug.get(slug) : '';
      if (!isPlaceholderImage(fromCategory)) return { ...shaped, image: fromCategory };
      if (!slug) {
        const anyProduct = shapedProducts.find((product) => !isPlaceholderImage(product.image));
        if (anyProduct?.image) return { ...shaped, image: anyProduct.image };
      }
    }
    return shaped;
  }

  const featuredPicks = shapedProducts.filter((product) => product.featured);
  const sellerPicks = shapedProducts.filter((product) => product.bestSeller);
  const salePicks = shapedProducts.filter((product) => product.originalPrice > product.price);
  const used = new Set();
  const takeUnique = (source, limit = 8) => {
    const picked = [];
    for (const product of source) {
      if (!product.id || used.has(product.id)) continue;
      used.add(product.id);
      picked.push(product);
      if (picked.length >= limit) break;
    }
    return picked;
  };

  const hero = (uiContent.hero || []).map(withResolvedBannerImage).filter((slide) => !isPlaceholderImage(slide.image));
  const promo = uiContent.promo ? withResolvedBannerImage(uiContent.promo) : null;
  const sides = (uiContent.deal?.sides || []).map(withResolvedBannerImage);
  const center = uiContent.deal?.center ? shapeBanner(uiContent.deal.center) : null;

  return {
    hero,
    promo,
    deal: { sides, center },
    testimonials: (uiContent.testimonials || []).map((review) => ({
      id: String(review.id),
      name: review.name,
      role: review.role || '',
      location: review.location || '',
      avatar: review.avatar || '',
      rating: review.rating || 5,
      text: review.text,
    })),
    categories: shapedCategories,
    featured: takeUnique(featuredPicks.length ? featuredPicks : shapedProducts),
    bestSellers: takeUnique(sellerPicks.length ? sellerPicks : salePicks),
    newArrivals: takeUnique(shapedProducts),
  };
}

function shapeArticle(article) {
  return {
    id: String(article.id),
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    body: article.body || '',
    image: article.image || '',
    imageAlt: article.imageAlt || article.title,
    seoTitle: article.seoTitle || '',
    metaDescription: article.metaDescription || '',
    focusKeyword: article.focusKeyword || '',
    links: (article.links || []).map((link) => ({ label: link.label, href: link.href })),
    published: article.published !== false,
    publishedAt: article.publishedAt || null,
    updatedAt: article.updatedAt || null,
  };
}

export function staticListPublishedArticles() {
  return (uiContent.articles || [])
    .filter((article) => article.published !== false)
    .map(shapeArticle);
}

export function staticGetPublishedArticle(slug) {
  const articles = staticListPublishedArticles();
  const article = articles.find((item) => item.slug === slug);
  if (!article) return null;
  return {
    article,
    related: articles
      .filter((item) => item.slug !== slug)
      .slice(0, 3)
      .map((item) => ({ title: item.title, href: `/blog/${item.slug}` })),
  };
}
