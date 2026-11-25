'use client';

import Link from 'next/link';
import { productPath, productAlt } from '@/lib/storePath';
import ProductImage from '@/components/user/ProductImage';
import ReadyToShipButton from '@/components/user/ReadyToShipButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductQuickActions from '@/components/user/ProductQuickActions';
import 'swiper/css';

function money(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function categoryLabel(slug) {
  if (!slug) return 'New arrival';
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function ArrivalCard({ product }) {
  const hasDiscount = product.originalPrice > product.price;
  const discount = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const href = productPath(product);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:rounded-3xl">
      <div className="relative aspect-[5/6] overflow-hidden bg-[#F8FAFC]">
        <Link href={href} className="absolute inset-0">
          <ProductImage src={product.image} alt={productAlt(product)} className="object-cover" sizes="(max-width: 768px) 80vw, 25vw" />
        </Link>

        <ProductQuickActions product={product} />

        <span className="pointer-events-none absolute bottom-2 left-2 z-10 rounded-md bg-[#DCFCE7] px-1.5 py-1 text-[9px] font-semibold uppercase tracking-[0.04em] text-[#166534] shadow-sm sm:bottom-4 sm:left-3 sm:px-2.5 sm:py-1.5 sm:text-[11px]">
          Just dropped
        </span>
      </div>

      <div className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3 sm:px-4 sm:py-4">
        <div className="min-w-0">
          <Link href={href}>
            <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-neutral-950 sm:text-[15px]">{product.name}</h3>
          </Link>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400 sm:text-[11px] sm:tracking-[0.18em]">
            {categoryLabel(product.category)}
          </p>
          {product.stock > 0 ? <ReadyToShipButton product={product} /> : null}
        </div>

        <div className="flex shrink-0 flex-row flex-wrap items-center gap-x-2 gap-y-1 sm:flex-col sm:items-end sm:text-right">
          <span className="text-[13px] font-bold text-neutral-950 sm:text-[15px]">{money(product.price)}</span>
          {hasDiscount ? (
            <span className="text-xs text-neutral-400 line-through sm:mt-1 sm:text-sm">{money(product.originalPrice)}</span>
          ) : null}
          {discount > 0 ? (
            <span className="rounded-sm bg-[#DCFCE7] px-1.5 py-0.5 text-[10px] font-semibold text-[#166534] sm:mt-1.5 sm:text-xs">
              {discount}% off
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function NewArrivals({ products = [] }) {
  const arrivals = products.slice(0, 8);

  if (!arrivals.length) return null;

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-5 max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#4D9E18]/40" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#4D9E18]">Fresh drop</p>
            <span className="h-px w-10 bg-[#4D9E18]/40" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">New Arrivals</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
            Fresh styles just landed — be the first to wear the season&apos;s newest looks.
          </p>
        </div>

        <div className="sm:hidden">
          <Swiper grabCursor spaceBetween={12} slidesPerView={2}>
            {arrivals.map((product) => (
              <SwiperSlide key={product.id} className="!h-auto">
                <ArrivalCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="hidden gap-5 sm:grid sm:grid-cols-2 xl:grid-cols-4">
          {arrivals.map((product) => (
            <ArrivalCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
