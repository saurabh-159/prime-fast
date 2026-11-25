import { pageHead } from '@/lib/pageMeta';

export const metadata = pageHead({
  title: 'Login',
  description: 'Sign in to the Prime Fast EV admin.',
  canonical: '/login',
  indexable: false,
});

export default function LoginLayout({ children }) {
  return children;
}
