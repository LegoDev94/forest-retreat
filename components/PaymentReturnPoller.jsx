'use client';
// Client-side poller for /payment/return.
// Calls refreshPaymentStatus every 3s until terminal, then refreshes the
// page so the server component re-renders with the right outcome.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { refreshPaymentStatus } from '../app/actions/booking';

const POLL_MS  = 3_000;
const MAX_TICKS = 12; // ≈ 36 seconds

export default function PaymentReturnPoller({ paymentReference }) {
  const router = useRouter();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!paymentReference || tick >= MAX_TICKS) return;
    const t = setTimeout(async () => {
      try {
        const r = await refreshPaymentStatus(paymentReference);
        const ps = (r?.payment_state || '').toLowerCase();
        if (['settled', 'authorized', 'failed', 'abandoned', 'voided'].includes(ps)) {
          // Terminal — let the server page re-render
          router.refresh();
          return;
        }
      } catch {}
      setTick((n) => n + 1);
    }, POLL_MS);
    return () => clearTimeout(t);
  }, [paymentReference, tick, router]);

  return null;
}
