'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import RemoteImg from '@/components/ui/RemoteImg';

const DEFAULT_IMAGE = '/products/shagun-pink.jpg';

export default function PromoBanner({ promo }) {
  const title = promo?.title || '';
  const subtitle = promo?.subtitle || '';
  const code = promo?.code || '';
  const ctaText = promo?.cta || 'Shop Sale';
  const ctaLink = promo?.href || '/products';
  const image = promo?.image || DEFAULT_IMAGE;
  const imageAlt = promo?.imageAlt || title;
  const endsAt = promo?.endsAt || null;
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!promo) return undefined;
    const endTime = endsAt ? new Date(endsAt).getTime() : Date.now() + 24 * 60 * 60 * 1000;

    const tick = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt, promo]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (!promo) return null;

  const pad = (n) => String(n).padStart(2, '0');
  const units = [
    { label: 'Hours', value: pad(timeLeft.hours) },
    { label: 'Minutes', value: pad(timeLeft.minutes) },
    { label: 'Seconds', value: pad(timeLeft.seconds) },
  ];

  return (
    <section className="relative mb-12 overflow-hidden rounded-2xl bg-[#161311] shadow-[0_24px_60px_rgba(22,19,17,0.16)] sm:rounded-3xl">
      <div className="grid lg:min-h-[420px] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10 flex flex-col justify-center px-5 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e7d3b0] sm:mb-5">
            <span className="h-px w-6 bg-[#e7d3b0] sm:w-8" />
            Live now
          </p>

          <h3 className="max-w-md text-[1.75rem] font-medium leading-tight tracking-tight text-[#f7f3ee] sm:text-5xl sm:leading-none">
            {title}
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65 sm:mt-4 sm:text-base">{subtitle}</p>

          {code ? (
            <button
              type="button"
              onClick={copyCode}
              className="group mt-5 inline-flex w-fit max-w-full items-center gap-3 border border-white/15 bg-white/5 px-3.5 py-2.5 text-[#f6efe6] backdrop-blur-sm transition hover:border-[#e7d3b0]/70 hover:bg-white/10 sm:mt-7 sm:gap-4 sm:px-4"
            >
              <span className="font-mono text-sm tracking-[0.28em]">{code}</span>
              <span className="h-4 w-px shrink-0 bg-white/20" />
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-white/70 group-hover:text-white">
                {copied ? <Check className="h-3.5 w-3.5 text-[#e7d3b0]" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </span>
            </button>
          ) : null}

          <div className="mt-6 flex flex-col items-start gap-5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-end sm:gap-8">
            <div className="flex items-start gap-3 sm:gap-4">
              {units.map((unit, index) => (
                <div key={unit.label} className="flex items-start gap-3 sm:gap-4">
                  <div>
                    <p className="text-[1.65rem] font-light tabular-nums tracking-tight text-[#f7f3ee] sm:text-4xl">
                      {unit.value}
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-white/45 sm:text-[10px] sm:tracking-[0.2em]">
                      {unit.label}
                    </p>
                  </div>
                  {index < units.length - 1 ? (
                    <span className="pt-0.5 text-xl font-light text-white/25 sm:pt-1 sm:text-2xl">:</span>
                  ) : null}
                </div>
              ))}
            </div>

            <Link
              href={ctaLink}
              className="group inline-flex w-full items-center justify-center gap-2 bg-[#f6efe6] px-5 py-3 text-sm font-medium tracking-wide text-[#161311] transition hover:bg-white sm:w-auto sm:px-6"
            >
              {ctaText}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[200px] sm:min-h-[300px] lg:min-h-full">
          <RemoteImg src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover object-[center_30%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-[#161311]/25 to-transparent lg:bg-gradient-to-r lg:from-[#161311] lg:via-[#161311]/40 lg:to-transparent" />
          <div className="pointer-events-none absolute inset-5 hidden border border-white/20 sm:block lg:inset-8" />
        </div>
      </div>
    </section>
  );
}
