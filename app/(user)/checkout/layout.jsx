import { pageHead } from '@/lib/pageMeta';

export const metadata = pageHead({
  title: 'Checkout',
  description: 'Complete your Prime Fast EV order.',
  canonical: '/checkout',
  indexable: false,
});

export default function CheckoutLayout({ children }) {
  return children;
}
