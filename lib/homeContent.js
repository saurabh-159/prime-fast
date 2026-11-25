import { connectDB } from '@/lib/mongodb';
import Banner from '@/models/Banner';
import Testimonial from '@/models/Testimonial';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { storePath } from '@/lib/storePath';
import { extractBatterySpecs } from '@/lib/batteryParse';
import {
  categorySlugFromHref,
  firstImageByCategorySlug,
  isPlaceholderImage,
  resolveCategoryImage,
} from '@/lib/categoryImage';
import { useStaticData } from '@/lib/dataMode';
import { staticGetHomeContent } from '@/lib/staticStore';

const HERO_SEED = [
  {
    placement: 'hero',
    title: 'Lithium Chargers',
    subtitle: '54.6V · 67.2V · NMC ready',
    badge: 'Just In',
    href: '/categories/lithium-battery-chargers',
    image: 'https://cdn.store.link/uploads/elyf/lithium-battery-chargers-image.jpg?versionId=iWs8W3gmwGwUhsrVnqulDt8vFHVcNArX',
    imageAlt: 'Lithium battery chargers for EV scooters',
    order: 1,
  },
  {
    placement: 'hero',
    title: 'Lead Acid Range',
    subtitle: 'Waterproof EV chargers',
    href: '/categories/lead-acid-ev-chargers',
    image: 'https://cdn.store.link/uploads/elyf/lead-acid-ev-chargers-image.jpg?versionId=oFQ6mjwEdZyaMP_5bp8dWvBalIvDXRh0',
    imageAlt: 'Lead acid EV chargers',
    accent: true,
    order: 2,
  },
  {
    placement: 'hero',
    title: 'Controllers',
    subtitle: 'DC-DC convertors & more',
    href: '/categories/ev-controllers-dc-dc-convertors',
    image: '/logo.png',
    imageAlt: 'EV controllers and DC-DC convertors',
    order: 3,
  },
  {
    placement: 'hero',
    title: 'Motors',
    subtitle: 'Drive systems & accessories',
    href: '/categories/ev-motors-motor-accessories',
    image: '/logo.png',
    imageAlt: 'EV motors and motor accessories',
    order: 4,
  },
  {
    placement: 'hero',
    title: 'BMS & Cells',
    subtitle: 'Battery management essentials',
    href: '/categories/ev-scooter-bms',
    image: '/logo.png',
    imageAlt: 'EV scooter BMS',
    order: 5,
  },
  {
    placement: 'hero',
    title: 'Shop All',
    subtitle: 'Batteries, chargers, spares',
    href: '/products',
    image: '/logo.png',
    imageAlt: 'Prime Fast EV catalog',
    order: 6,
  },
];

const EXTRA_SEED = [
  {
    placement: 'promo',
    title: 'Fleet Ready',
    subtitle: 'Voltage-matched chargers and battery spares for every EV scooter',
    code: 'EVFAST',
    cta: 'Shop Chargers',
    href: '/products',
    image: 'https://cdn.store.link/uploads/elyf/lithium-battery-chargers-image.jpg?versionId=iWs8W3gmwGwUhsrVnqulDt8vFHVcNArX',
    imageAlt: 'Lithium EV chargers',
    endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    order: 1,
  },
  {
    placement: 'deal-side',
    title: 'Lithium',
    href: '/categories/lithium-battery-chargers',
    image: 'https://cdn.store.link/uploads/elyf/lithium-battery-chargers-image.jpg?versionId=iWs8W3gmwGwUhsrVnqulDt8vFHVcNArX',
    hoverImage: 'https://cdn.store.link/uploads/elyf/lead-acid-ev-chargers-image.jpg?versionId=oFQ6mjwEdZyaMP_5bp8dWvBalIvDXRh0',
    imageAlt: 'Lithium battery chargers',
    order: 1,
  },
  {
    placement: 'deal-center',
    title: 'Right voltage. Right amp.',
    subtitle: 'Filter by Voltage, Capacity, Brand, and Battery Type to match your scooter.',
    badge: 'The EV edit',
    cta: 'Shop batteries',
    href: '/products',
    order: 1,
  },
  {
    placement: 'deal-side',
    title: 'Lead Acid',
    href: '/categories/lead-acid-ev-chargers',
    image: 'https://cdn.store.link/uploads/elyf/lead-acid-ev-chargers-image.jpg?versionId=oFQ6mjwEdZyaMP_5bp8dWvBalIvDXRh0',
    hoverImage: 'https://cdn.store.link/uploads/elyf/lithium-battery-chargers-image.jpg?versionId=iWs8W3gmwGwUhsrVnqulDt8vFHVcNArX',
    imageAlt: 'Lead acid EV chargers',
    order: 2,
  },
];

const REVIEW_SEED = [
  {
    name: 'Priya Sharma',
    role: 'Fleet Owner',
    avatar: 'https://i.pravatar.cc/150?img=47',
    rating: 5,
    text: 'Voltage labels are clear and the 67.2V chargers matched our NMC packs perfectly. Packing was solid for courier.',
    location: 'Mumbai',
    order: 1,
  },
  {
    name: 'Rahul Verma',
    role: 'Service Centre',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    text: 'Easy to filter by amp and battery type. Lead acid waterproof chargers are now our default reorder.',
    location: 'Bangalore',
    order: 2,
  },
  {
    name: 'Ananya Iyer',
    role: 'EV Rider',
    avatar: 'https://i.pravatar.cc/150?img=32',
    rating: 5,
    text: 'Found the exact 54.6V 6A charger for my scooter. Honest pricing and fast dispatch.',
    location: 'Chennai',
    order: 3,
  },
  {
    name: 'Arjun Mehta',
    role: 'Workshop',
    avatar: 'https://i.pravatar.cc/150?img=15',
    rating: 4,
    text: 'Good range of controllers and BMS parts. Would love more warranty badges on every listing.',
    location: 'Delhi',
    order: 4,
  },
  {
    name: 'Kavya Reddy',
    role: 'Dealer',
    avatar: 'https://i.pravatar.cc/150?img=45',
    rating: 5,
    text: 'Clean catalog for EV spares. Brand filters (IMP, GRAPHY, SUN6) save a lot of time.',
    location: 'Hyderabad',
    order: 5,
  },
];

function shapeBanner(banner) {
  return {
    id: String(banner._id),
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
    endsAt: banner.endsAt ? new Date(banner.endsAt).toISOString() : null,
    order: banner.order || 0,
    active: banner.active !== false,
  };
}

function shapeProduct(product) {
  const category = product.category;
  const slug = category && typeof category === 'object' ? category.slug || '' : '';
  return {
    id: String(product._id),
    slug: product.slug || '',
    name: product.name,
    image: product.image || '',
    price: Number(product.price || 0),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    stock: product.stock ?? 0,
    category: slug,
    categoryName: category && typeof category === 'object' ? category.name || '' : '',
    featured: Boolean(product.featured),
    bestSeller: Boolean(product.bestSeller),
    specs: extractBatterySpecs(product.name || '', product.attributes || []),
  };
}

function shapeCategory(category, count, productImage = '') {
  // Prefer a real product photo when available so cards never show the brand logo.
  const image = !isPlaceholderImage(productImage)
    ? String(productImage).trim()
    : resolveCategoryImage(category.image, productImage);
  const usedProductImage = !isPlaceholderImage(productImage);
  return {
    id: String(category._id),
    name: category.name,
    slug: category.slug,
    blurb: category.blurb || '',
    image,
    imageFocus: category.imageFocus || 'center',
    imageFit: usedProductImage ? 'cover' : category.imageFit || '',
    imageBg: category.imageBg || '',
    count,
  };
}

async function seedIfEmpty() {
  const hero = await Banner.findOne({ placement: 'hero' }).sort({ order: 1 }).lean();
  const looksEthnic =
    hero && /chanderi|lehenga|suit|gotapatti|tyohar|kurta|ethnic/i.test(`${hero.title} ${hero.subtitle}`);
  if ((await Banner.countDocuments()) === 0 || looksEthnic) {
    await Banner.deleteMany({});
    await Banner.insertMany([...HERO_SEED, ...EXTRA_SEED]);
  }
  const review = await Testimonial.findOne().sort({ order: 1 }).lean();
  const reviewEthnic =
    review && /lehenga|embroidery|fabric|gotapatti|suit set|festive/i.test(String(review.text || ''));
  if ((await Testimonial.countDocuments()) === 0 || reviewEthnic) {
    await Testimonial.deleteMany({});
    await Testimonial.insertMany(REVIEW_SEED);
  }
}

export async function getHomeContent() {
  if (useStaticData()) return staticGetHomeContent();
  await connectDB();
  await seedIfEmpty();

  const [banners, reviews, products, categories, categoryCounts, categoryImages] = await Promise.all([
    Banner.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean(),
    Testimonial.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean(),
    Product.find().populate('category', 'name slug').sort({ createdAt: -1 }).limit(48).lean(),
    Category.find().sort({ name: 1 }).lean(),
    Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    Product.aggregate([
      { $match: { image: { $exists: true, $nin: [null, '', '/logo.png'] } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$category', image: { $first: '$image' } } },
    ]),
  ]);

  const shapedProducts = products.map(shapeProduct);
  const countById = new Map(categoryCounts.map((row) => [String(row._id), row.count || 0]));
  const imageById = new Map(categoryImages.map((row) => [String(row._id), row.image]));
  const productImageBySlug = firstImageByCategorySlug(shapedProducts);
  for (const category of categories) {
    const fromDb = imageById.get(String(category._id));
    if (fromDb && !productImageBySlug.has(category.slug)) {
      productImageBySlug.set(category.slug, fromDb);
    }
  }
  const allShapedCategories = categories.map((category) =>
    shapeCategory(
      category,
      countById.get(String(category._id)) || 0,
      productImageBySlug.get(category.slug) || imageById.get(String(category._id)) || '',
    ),
  );
  // Home showcase: skip empty logo placeholders — no product image to show yet
  const shapedCategories = allShapedCategories
    .filter((category) => category.count > 0 && !isPlaceholderImage(category.image))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  // slug -> best display image (prefer product photo, else real category image)
  const imageByCategorySlug = new Map();
  for (const category of allShapedCategories) {
    if (!isPlaceholderImage(category.image)) {
      imageByCategorySlug.set(category.slug, category.image);
    }
  }

  function withResolvedBannerImage(banner) {
    const shaped = shapeBanner(banner);
    const slug = categorySlugFromHref(shaped.href);

    // Hero/category card has no real image → use a product image from that category
    if (isPlaceholderImage(shaped.image)) {
      const fromCategory = slug ? imageByCategorySlug.get(slug) : '';
      if (!isPlaceholderImage(fromCategory)) {
        return { ...shaped, image: fromCategory };
      }
      // Shop-all (or similar) with no category: use any product photo
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
  const promo = banners.find((banner) => banner.placement === 'promo');
  const center = banners.find((banner) => banner.placement === 'deal-center');

  return {
    // Drop hero slides that still only have the logo (category has no products yet)
    hero: banners
      .filter((banner) => banner.placement === 'hero')
      .map(withResolvedBannerImage)
      .filter((slide) => !isPlaceholderImage(slide.image)),
    promo: promo ? withResolvedBannerImage(promo) : null,
    deal: {
      sides: banners.filter((banner) => banner.placement === 'deal-side').map(withResolvedBannerImage),
      center: center ? shapeBanner(center) : null,
    },
    testimonials: reviews.map((review) => ({
      id: String(review._id),
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
