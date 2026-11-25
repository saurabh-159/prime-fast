'use client';

import Link from 'next/link';
import { productPath, productAlt } from '@/lib/storePath';
import ProductImage from '@/components/user/ProductImage';
import { Star } from 'lucide-react';
import ProductQuickActions, { ProductCartButton } from '@/components/user/ProductQuickActions';

function money(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function categoryLabel(slug) {
  if (!slug) return '';
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function SpecBadges({ specs }) {
  if (!specs) return null;
  const chips = [specs.voltage, specs.capacityAh || specs.currentA, specs.batteryType, specs.warranty].filter(
    Boolean,
  );
  if (!chips.length) return null;
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {chips.slice(0, 3).map((chip) => (
        <span
          key={chip}
          className="rounded bg-[#DCFCE7] px-1.5 py-0.5 text-[10px] font-medium text-[#166534]"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const hasDiscount = product.originalPrice > product.price;
  const discount = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const href = productPath(product);

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F8FAFC]">
        <Link href={href} className="absolute inset-0">
          <ProductImage
            src={product.image}
            alt={productAlt(product)}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        {discount > 0 ? (
          <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-[#DCFCE7] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#166534] sm:left-3 sm:top-3 sm:px-2.5 sm:text-[10px] sm:tracking-[0.14em]">
            {discount}% off
          </span>
        ) : null}
        <ProductQuickActions product={product} compact showCart={false} />
      </div>

      <div className="flex items-end justify-between gap-2 px-3 pb-3 pt-2.5 sm:gap-3 sm:px-3.5 sm:pb-3.5 sm:pt-3">
        <Link href={href} className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#52525B] sm:text-[11px] sm:tracking-[0.16em]">
            {categoryLabel(product.category)}
          </p>
          <h3 className="mt-1 line-clamp-2 text-[13px] font-medium leading-snug text-[#18181B] sm:truncate sm:text-sm">
            {product.name}
          </h3>
          <SpecBadges specs={product.specs} />
          <p className="mt-1.5 flex items-baseline gap-2 sm:mt-2">
            <span className="text-[13px] font-semibold text-[#4D9E18] sm:text-sm">{money(product.price)}</span>
            {hasDiscount ? (
              <span className="text-[11px] text-[#52525B] line-through sm:text-xs">{money(product.originalPrice)}</span>
            ) : null}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-[#52525B] sm:hidden">
            <Star className="h-3 w-3 fill-[#18181B] text-[#18181B]" />
            {product.rating}
          </p>
        </Link>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <ProductCartButton product={product} />
          <p className="hidden items-center gap-1 text-xs text-[#52525B] sm:flex">
            <Star className="h-3.5 w-3.5 fill-[#18181B] text-[#18181B]" />
            {product.rating}
          </p>
        </div>
      </div>
    </article>
  );
}
