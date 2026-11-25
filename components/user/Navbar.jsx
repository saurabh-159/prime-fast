'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RemoteImg from '@/components/ui/RemoteImg';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Heart,
  LayoutGrid,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { api } from '@/lib/apiClient';
import { useCatalog } from '@/components/user/CatalogProvider';
import CartAddedNotice from '@/components/user/CartAddedNotice';
import { lockBodyScroll } from '@/lib/scrollLock';
import GoogleAuthButton from '@/components/user/GoogleAuthButton';

function CategoryTile({ category, active, onActivate }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${
        active
          ? 'border-[var(--brand-gold)]/45 bg-[var(--brand-gold)]/[0.08] shadow-[0_0_0_1px_rgba(77,158,24,0.12)]'
          : 'border-black/[0.08] bg-white hover:border-black/[0.14] hover:bg-[#FAFAFA]'
      }`}
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F8FAFC] ring-1 ring-black/[0.05]">
        {category.image ? (
          <RemoteImg src={category.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <LayoutGrid className="h-3.5 w-3.5 text-[var(--brand-gold)]" aria-hidden />
        )}
      </span>
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-neutral-900">
        {category.name}
      </span>
      <ChevronRight
        className={`h-4 w-4 shrink-0 ${active ? 'text-[var(--brand-gold)]' : 'text-neutral-300'}`}
        aria-hidden
      />
    </Link>
  );
}

function BrandLockup({ priority = false }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white">
        <Image
          src={BRAND.mark.icon}
          alt=""
          width={80}
          height={80}
          sizes="40px"
          priority={priority}
          aria-hidden
          className="h-full w-full object-contain p-0.5"
        />
      </span>
      <span className="flex min-w-0 flex-col justify-center leading-none">
        <span className="text-[15px] font-extrabold italic tracking-tight sm:text-base">
          <span className="text-[#18181B]">PRIME</span>{' '}
          <span className="text-[#4D9E18]">FAST</span>
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#52525B]">
          EV • SMART • CLEAN
        </span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const { categories, products, cartCount, wishlistIds, user, authReady, refreshSession, openCart } =
    useCatalog();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const searchRef = useRef(null);
  const accountRef = useRef(null);
  const categoriesCloseTimer = useRef(null);

  const previewCategory =
    categories.find((category) => category.id === activeCategoryId) || categories[0] || null;
  const previewItems = previewCategory
    ? products.filter((product) => product.category === previewCategory.slug).slice(0, 8)
    : [];

  function openCategoriesMenu() {
    if (categoriesCloseTimer.current) clearTimeout(categoriesCloseTimer.current);
    setCategoriesOpen(true);
    if (!activeCategoryId && categories[0]) setActiveCategoryId(categories[0].id);
  }

  function scheduleCloseCategoriesMenu() {
    if (categoriesCloseTimer.current) clearTimeout(categoriesCloseTimer.current);
    categoriesCloseTimer.current = setTimeout(() => setCategoriesOpen(false), 140);
  }

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!accountOpen && !categoriesOpen) return undefined;
    function onPointerDown(event) {
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setAccountOpen(false);
        setCategoriesOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [accountOpen, categoriesOpen]);

  useEffect(() => {
    return () => {
      if (categoriesCloseTimer.current) clearTimeout(categoriesCloseTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const unlock = lockBodyScroll();
    function onKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      unlock();
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className="sticky top-0 z-40 bg-white"
      style={{ '--brand-gold': BRAND.accent, '--brand': BRAND.accent }}
    >
      <div className="bg-[#111827] px-4 py-2 text-center sm:px-6 lg:px-8">
        <p className="text-[11px] font-medium tracking-wide text-white/90 sm:text-xs">
          Fast Dispatch Across India • Genuine EV Batteries &amp; Chargers
        </p>
      </div>

      {/* Main bar */}
      <div className="border-b border-black/[0.06] bg-white">
        <div className="mx-auto flex h-[70px] max-w-[1400px] items-center gap-3 px-4 sm:h-[76px] sm:px-6 lg:px-8">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-800 transition hover:bg-[#F8FAFC] lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" aria-label={BRAND.name} className="shrink-0 transition-opacity hover:opacity-80">
            <BrandLockup priority />
          </Link>

          {/* Desktop search — center */}
          <form
            action="/products"
            className="mx-auto hidden w-full max-w-md items-center rounded-full border border-black/[0.07] bg-[#F8FAFC] transition focus-within:border-[var(--brand-gold)]/55 focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--brand-gold)]/20 md:flex"
          >
            <Search className="ml-4 h-4 w-4 shrink-0 text-neutral-400" />
            <input
              name="search"
              aria-label="Search products"
              placeholder="Search batteries, chargers, motors…"
              className="h-11 w-full bg-transparent px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </form>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1 md:ml-0">
            <button
              type="button"
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition hover:bg-[#F8FAFC] md:hidden"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition hover:bg-[#F8FAFC] sm:inline-flex"
            >
              <Heart className="h-[18px] w-[18px]" />
              {wishlistIds.length > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-bold leading-none text-white">
                  {wishlistIds.length}
                </span>
              ) : null}
            </Link>

            <div className="relative" ref={accountRef}>
              <button
                type="button"
                aria-label="Account"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((open) => !open)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition hover:bg-[#F8FAFC]"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <User className="h-[18px] w-[18px]" />
                )}
              </button>

              {accountOpen ? (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_16px_40px_rgba(22,19,17,0.12)]">
                  {!authReady ? (
                    <p className="text-sm text-neutral-500">Checking account…</p>
                  ) : user ? (
                    <div>
                      <p className="truncate text-sm font-medium text-neutral-950">{user.name}</p>
                      <p className="truncate text-xs text-neutral-500">{user.email}</p>
                      <div className="mt-3 grid gap-1">
                        <Link
                          href="/profile"
                          onClick={() => setAccountOpen(false)}
                          className="rounded-xl px-3 py-2 text-sm text-neutral-800 transition hover:bg-[#F8FAFC]"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setAccountOpen(false)}
                          className="rounded-xl px-3 py-2 text-sm text-neutral-800 transition hover:bg-[#F8FAFC]"
                        >
                          Orders
                        </Link>
                        <button
                          type="button"
                          className="rounded-xl px-3 py-2 text-left text-sm text-neutral-800 transition hover:bg-[#F8FAFC]"
                          onClick={async () => {
                            await api('/api/auth/logout', { method: 'POST' });
                            await refreshSession();
                            setAccountOpen(false);
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Account
                      </p>
                      <p className="mt-1 text-sm font-medium text-neutral-950">Login or sign up</p>
                      <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                        Continue with Google. A new account is created the first time you sign in.
                      </p>
                      <div className="mt-3">
                        <GoogleAuthButton onSuccess={() => setAccountOpen(false)} />
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label="Open bag"
                onClick={openCart}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition hover:bg-[#F8FAFC]"
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-bold leading-none text-white">
                  {cartCount}
                </span>
              </button>
              <CartAddedNotice />
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-black/[0.05] px-4 py-3 md:hidden">
            <form
              action="/products"
              className="flex items-center rounded-full border border-black/[0.07] bg-[#F8FAFC] px-3.5"
            >
              <Search className="h-4 w-4 text-neutral-400" />
              <input
                ref={searchRef}
                name="search"
                aria-label="Search products"
                autoFocus
                placeholder="Search Prime Fast EV…"
                className="h-11 w-full bg-transparent px-2.5 text-sm outline-none placeholder:text-neutral-400"
              />
            </form>
          </div>
        )}
      </div>

      {/* Secondary nav — desktop Categories mega menu */}
      <nav
        className="relative hidden border-b border-black/[0.06] bg-[#F1F5F9] lg:block"
        aria-label="Shop navigation"
      >
        <div className="mx-auto flex h-11 max-w-[1400px] items-center gap-1 px-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="rounded-lg px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:bg-white/70 hover:text-black"
          >
            All products
          </Link>

          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={categoriesOpen}
            onMouseEnter={openCategoriesMenu}
            onMouseLeave={scheduleCloseCategoriesMenu}
            onFocus={openCategoriesMenu}
            className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition ${
              categoriesOpen
                ? 'bg-white text-black'
                : 'text-neutral-800 hover:bg-white/70 hover:text-black'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5 text-[var(--brand-gold)]" aria-hidden />
            Categories
            <ChevronDown
              className={`h-3.5 w-3.5 transition duration-200 ${
                categoriesOpen ? 'rotate-180 text-neutral-700' : 'text-neutral-400'
              }`}
              aria-hidden
            />
            <span
              className={`absolute inset-x-3 -bottom-[7px] h-0.5 rounded-full bg-[var(--brand-gold)] transition duration-200 ${
                categoriesOpen ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </button>
        </div>

        {categoriesOpen ? (
          <div
            className="absolute inset-x-0 top-full z-50 pt-2"
            onMouseEnter={openCategoriesMenu}
            onMouseLeave={scheduleCloseCategoriesMenu}
          >
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_20px_50px_rgba(22,19,17,0.14)]">
                <div className="border-b border-black/[0.06] p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-end">
                    <Link
                      href="/categories"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-800 transition hover:border-[var(--brand-gold)]/40 hover:bg-[var(--brand-gold)]/[0.06] hover:text-black"
                    >
                      <LayoutGrid className="h-3.5 w-3.5 text-[var(--brand-gold)]" aria-hidden />
                      Browse all
                    </Link>
                  </div>

                  {categories.length ? (
                    <div className="grid max-h-[min(18rem,42vh)] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3 xl:grid-cols-5">
                      {categories.map((category) => (
                        <CategoryTile
                          key={category.id}
                          category={category}
                          active={previewCategory?.id === category.id}
                          onActivate={() => setActiveCategoryId(category.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-sm text-neutral-500">No categories yet.</p>
                  )}
                </div>

                {previewCategory ? (
                  <div className="bg-[#FAFBFC] p-4 sm:p-5">
                    <div className="mb-3 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-gold)]">
                          Subcategories
                        </p>
                        <p className="mt-0.5 truncate text-base font-semibold text-neutral-950">
                          {previewCategory.name}
                        </p>
                      </div>
                      <Link
                        href={`/categories/${previewCategory.slug}`}
                        className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-neutral-700 transition hover:text-black"
                      >
                        View all
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
                      <Link
                        href={`/categories/${previewCategory.slug}`}
                        className="flex items-center gap-2.5 rounded-xl border border-[var(--brand-gold)]/35 bg-[var(--brand-gold)]/[0.07] px-3 py-2.5 transition hover:border-[var(--brand-gold)]/55"
                      >
                        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-black/[0.05]">
                          {previewCategory.image ? (
                            <RemoteImg
                              src={previewCategory.image}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <LayoutGrid className="h-3.5 w-3.5 text-[var(--brand-gold)]" aria-hidden />
                          )}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-neutral-900">
                          Shop all {previewCategory.name}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[var(--brand-gold)]" aria-hidden />
                      </Link>

                      {previewItems.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug || product.id}`}
                          className="flex items-center gap-2.5 rounded-xl border border-black/[0.08] bg-white px-3 py-2.5 transition hover:border-black/[0.14]"
                        >
                          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F8FAFC] ring-1 ring-black/[0.05]">
                            {product.image ? (
                              <RemoteImg src={product.image} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <LayoutGrid className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
                            )}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-neutral-900">
                            {product.name}
                          </span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" aria-hidden />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </nav>

      {/* Mobile drawer — keep mounted so open/close can animate */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Close menu overlay"
          tabIndex={menuOpen ? 0 : -1}
          className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          className={`absolute inset-y-0 left-0 flex w-[min(88vw,360px)] transform-gpu flex-col bg-[#F8FAFC] shadow-[12px_0_40px_rgba(22,19,17,0.18)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-label="Mobile"
        >
          <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] bg-white px-4 py-4">
            <Link href="/" onClick={() => setMenuOpen(false)} className="min-w-0" tabIndex={menuOpen ? 0 : -1}>
              <BrandLockup />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition hover:bg-[#F8FAFC]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            <form action="/products" className="px-4 pt-4" onSubmit={() => setMenuOpen(false)}>
              <div className="flex items-center rounded-full border border-black/[0.07] bg-white px-3.5">
                <Search className="h-4 w-4 text-neutral-400" />
                <input
                  name="search"
                  aria-label="Search products"
                  tabIndex={menuOpen ? 0 : -1}
                  placeholder="Search batteries, chargers…"
                  className="h-11 w-full bg-transparent px-2.5 text-sm outline-none placeholder:text-neutral-400"
                />
              </div>
            </form>

            <div className="grid grid-cols-2 gap-2 px-4 pt-4">
              {[
                { href: '/products', label: 'Shop all' },
                { href: '/categories', label: 'Categories' },
                { href: '/wishlist', label: wishlistIds.length ? `Wishlist (${wishlistIds.length})` : 'Wishlist' },
                { href: '/orders', label: 'Orders' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl bg-white px-3 py-3 text-sm font-medium text-neutral-900 ring-1 ring-black/[0.06] transition hover:bg-[#F8FAFC]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="px-5 pb-3 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                Categories
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 px-4 pb-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => setMenuOpen(false)}
                  className="group overflow-hidden rounded-2xl bg-white ring-1 ring-black/5"
                >
                  <span className="relative block aspect-[4/5] overflow-hidden bg-[#F8FAFC]">
                    <RemoteImg
                      src={category.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-400 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-2.5">
                      <span className="block text-[12px] font-semibold leading-snug text-white drop-shadow-sm">
                        {category.name}
                      </span>
                      {category.blurb ? (
                        <span className="mt-0.5 line-clamp-2 block text-[10px] leading-snug text-white/75">
                          {category.blurb}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-black/[0.06] bg-white px-4 py-4">
            {user ? (
              <Link
                href="/profile"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8FAFC] text-neutral-800">
                    <User className="h-4 w-4" />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-neutral-950">{user.name}</span>
                  <span className="block truncate text-xs text-neutral-500">{user.email}</span>
                </span>
              </Link>
            ) : (
              <div>
                <p className="text-sm font-medium text-neutral-950">Login or sign up</p>
                <div className="mt-3">
                  <GoogleAuthButton onSuccess={() => setMenuOpen(false)} />
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
