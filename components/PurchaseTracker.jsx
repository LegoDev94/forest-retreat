'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { trackPurchase } from '../lib/analytics';

export default function PurchaseTracker({ booking, locale, redirectToAccount = false }) {
  const router = useRouter();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !booking?.id) return;
    fired.current = true;

    trackPurchase({ booking, email: booking.email });

    if (redirectToAccount) {
      const t = setTimeout(() => router.replace(`/${locale}/account?welcome=1`), 800);
      return () => clearTimeout(t);
    }
  }, [booking, locale, redirectToAccount, router]);

  return null;
}
