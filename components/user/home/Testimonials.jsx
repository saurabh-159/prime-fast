'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

const stats = [
  { value: '4.9/5', label: 'Average rating' },
  { value: '10K+', label: 'Happy customers' },
  { value: '98%', label: 'Would recommend' },
  { value: '5000+', label: 'Five-star reviews' },
];

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${index < rating ? 'fill-[#76C82A] text-[#76C82A]' : 'text-white/20'}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function Testimonials({ items = [] }) {
  const swiperRef = useRef(null);
  if (!items.length) return null;

  return (
    <section className="bg-[#14181F] py-10 sm:py-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8 md:pl-10">
          <div className="mx-auto max-w-2xl text-center sm:mx-0 sm:text-left">
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <span className="h-px w-10 bg-white/20" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#76C82A]">Customer love</p>
              <span className="h-px w-10 bg-white/20 sm:hidden" />
            </div>
            <h2 className="mt-3 text-[1.65rem] font-bold tracking-tight text-white sm:mt-4 sm:text-3xl md:text-4xl">
              What our customers say
            </h2>
            <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-white/60 sm:mx-0 sm:mt-3">
              Real notes from fleet owners, workshops, and EV riders who shop Prime Fast EV.
            </p>
          </div>

          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Previous reviews"
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#1E242E] text-white shadow-sm transition hover:border-[#4D9E18] hover:bg-[#4D9E18]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next reviews"
              onClick={() => swiperRef.current?.slideNext()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#1E242E] text-white shadow-sm transition hover:border-[#4D9E18] hover:bg-[#4D9E18]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Autoplay]}
          loop={items.length > 6}
          grabCursor
          spaceBetween={14}
          slidesPerView={1.22}
          autoplay={{
            delay: 3200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 16 },
            1280: { slidesPerView: 3, spaceBetween: 16 },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id} className="!h-auto">
              <article className="flex h-full flex-col rounded-2xl border border-white/8 bg-[#1E242E] p-4 sm:rounded-3xl sm:p-6">
                <Stars rating={item.rating} />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/75 sm:mt-4">&ldquo;{item.text}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4 sm:mt-6 sm:pt-5">
                  <img src={item.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-[#4D9E18]/30 sm:h-11 sm:w-11" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{item.name}</p>
                    <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-[0.12em] text-white/40 sm:text-[11px] sm:tracking-[0.16em]">
                      {item.role} · {item.location}
                    </p>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 md:grid-cols-4 md:gap-4">
          {stats.map((stat) => (
            <li key={stat.label} className="rounded-2xl border border-white/8 bg-[#1E242E] px-3 py-4 text-center sm:px-4 sm:py-5">
              <p className="text-xl font-semibold tracking-tight text-[#76C82A] sm:text-2xl">{stat.value}</p>
              <p className="mt-1 text-[10px] font-medium uppercase leading-snug tracking-[0.12em] text-white/45 sm:text-[11px] sm:tracking-[0.16em]">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
