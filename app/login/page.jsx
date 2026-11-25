'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/apiClient';
import { BRAND } from '@/lib/brand';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      });
      if (data.user?.role !== 'admin') {
        setError('Unauthorized');
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E4E4E7] bg-white p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <Link href="/" aria-label={BRAND.name}>
            <Image
              src={BRAND.logo.light}
              alt={BRAND.name}
              width={200}
              height={42}
              priority
              className="h-[42px] w-auto object-contain"
            />
          </Link>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-[#52525B]">
            {BRAND.tagline}
          </p>
        </div>
        <h1 className="mb-6 text-center text-2xl font-bold text-[#18181B]">Admin login</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input label="Email" name="email" type="email" required />
          <Input label="Password" name="password" type="password" required />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}
