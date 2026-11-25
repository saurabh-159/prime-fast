import Link from 'next/link';
import { BRAND } from '@/lib/brand';
import RemoteImg from '@/components/ui/RemoteImg';

const PANEL = BRAND.accent;
const HIGHLIGHT = '#E8FF6B';
const FLAG_COLORS = [
  BRAND.accentBright,
  '#E8FF6B',
  BRAND.accentHover,
  '#A3E635',
  '#FACC15',
  '#86EFAC',
  BRAND.accent,
  '#FFFFFF',
];

function Bunting() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 overflow-hidden" aria-hidden="true">
      <div className="h-px bg-white/40" />
      <div className="flex">
        {Array.from({ length: 36 }, (_, index) => (
          <span
            key={index}
            className="h-4 w-3 shrink-0"
            style={{
              marginLeft: '3px',
              backgroundColor: FLAG_COLORS[index % FLAG_COLORS.length],
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Garland({ side }) {
  const position = side === 'left' ? 'left-2 sm:left-5' : 'right-2 sm:right-5';

  return (
    <div
      className={`pointer-events-none absolute top-5 z-20 hidden flex-col items-center sm:top-6 sm:flex ${position}`}
      aria-hidden="true"
    >
      <span className="h-8 w-px bg-white/50" />
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: HIGHLIGHT }} />
      <span className="mt-1 h-2 w-2 rounded-full" style={{ backgroundColor: BRAND.accentBright }} />
      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-white/90" />
    </div>
  );
}

function Ornament() {
  return (
    <svg viewBox="0 0 24 24" className="mt-5 h-4 w-4 text-white/85" aria-hidden="true">
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="0.7" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
      />
    </svg>
  );
}

function PromoPanel({ children, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.25rem] border border-white/25 shadow-[0_16px_40px_rgba(61,130,18,0.22)] sm:rounded-[1.75rem] ${className}`}
      style={{ backgroundColor: PANEL }}
    >
      <Bunting />
      <Garland side="left" />
      <Garland side="right" />
      {children}
    </div>
  );
}

function Banner({ title, subtitle, href }) {
  const content = (
    <div className="px-5 pb-6 pt-8 text-center sm:px-6 sm:pb-9 sm:pt-12">
      <h2 className="text-xl font-bold uppercase tracking-[0.12em] text-white sm:text-4xl sm:tracking-[0.14em]">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-[13px] leading-snug italic text-white/95 sm:text-[15px]">
        {subtitle}
      </p>
    </div>
  );

  if (!href) return <PromoPanel>{content}</PromoPanel>;

  return (
    <PromoPanel>
      <Link href={href} className="block transition duration-300 hover:brightness-105">
        {content}
      </Link>
    </PromoPanel>
  );
}

function SideImage({ banner, position, hoverPosition }) {
  if (!banner?.image) return null;
  return (
    <Link
      href={banner.href || '/products'}
      className="group relative block h-[260px] overflow-hidden rounded-[1.25rem] shadow-[0_16px_40px_rgba(20,24,31,0.12)] sm:h-[480px] sm:rounded-[1.75rem] lg:h-[580px]"
    >
      <RemoteImg
        src={banner.image}
        alt={banner.imageAlt || banner.title || ''}
        className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:opacity-0"
        style={{ objectPosition: position }}
      />
      <RemoteImg
        src={banner.hoverImage || banner.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100"
        style={{ objectPosition: hoverPosition }}
      />
    </Link>
  );
}

function CenterPanel({ banner }) {
  if (!banner) return null;
  return (
    <PromoPanel className="min-h-[280px] sm:h-[480px] lg:h-[580px]">
      <div className="flex h-full flex-col items-center justify-center px-5 py-8 text-center sm:px-8 sm:py-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80 sm:text-[11px] sm:tracking-[0.28em]">
          {banner.badge || 'The EV edit'}
        </p>
        <h3
          className="mt-3 max-w-[16rem] text-2xl font-extrabold uppercase leading-[1.05] tracking-wide sm:mt-4 sm:text-4xl"
          style={{ color: HIGHLIGHT }}
        >
          {banner.title}
        </h3>
        <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-white/95 sm:mt-4 sm:text-sm">{banner.subtitle}</p>
        <Ornament />
        <Link
          href={banner.href || '/products'}
          className="mt-4 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition duration-300 hover:brightness-95 sm:mt-5"
          style={{ color: BRAND.accentHover }}
        >
          {banner.cta || 'Shop the edit'}
        </Link>
      </div>
    </PromoPanel>
  );
}

export default function DealOfTheDay({ deal }) {
  const sides = deal?.sides || [];
  const center = deal?.center || null;
  if (!sides.length && !center) return null;

  return (
    <section className="mb-12 flex flex-col gap-3 sm:mb-16 sm:gap-4">
      <Banner
        title="Deal of the day"
        subtitle="Top EV picks, locked in while the offer lasts."
      />
      <div className="grid w-full grid-cols-1 items-stretch gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.8fr)_minmax(0,1.25fr)]">
        <SideImage banner={sides[0]} position="center 22%" hoverPosition="center 18%" />
        <CenterPanel banner={center} />
        <SideImage banner={sides[1]} position="center 18%" hoverPosition="center 22%" />
      </div>
      <Banner
        title="Everyday edit"
        subtitle="Reliable chargers, batteries, and parts for daily rides."
        href="/products"
      />
    </section>
  );
}
