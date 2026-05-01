import Link from 'next/link';
import { redirect } from 'next/navigation';
import { refreshPaymentStatus } from '../../../actions/booking';
import { DICT, pick } from '../../../../lib/dict';
import { getCurrentUser } from '../../../../lib/supabase/session';

export const dynamic = 'force-dynamic';

const LOCALES = ['ru', 'lv', 'en'];

const COPY = {
  paid: {
    ru: { title: 'Оплата прошла', body: 'Спасибо! Ваше бронирование подтверждено. Мы отправили детали на email.', cta: 'На главную' },
    lv: { title: 'Apmaksāts',    body: 'Paldies! Jūsu rezervācija ir apstiprināta. Detaļas nosūtītas uz e-pastu.', cta: 'Uz sākumu' },
    en: { title: 'Payment received', body: 'Thanks! Your booking is confirmed. Details have been sent to your email.', cta: 'Back home' },
  },
  pending: {
    ru: { title: 'Платёж в обработке', body: 'Банк ещё подтверждает оплату. Это может занять минуту. Мы пришлём подтверждение на email.', cta: 'На главную' },
    lv: { title: 'Maksājums tiek apstrādāts', body: 'Banka vēl apstiprina maksājumu. Tas var aizņemt minūti. Apstiprinājumu sūtīsim uz e-pastu.', cta: 'Uz sākumu' },
    en: { title: 'Payment processing', body: "The bank is still confirming. This usually takes a minute. We'll send confirmation to your email.", cta: 'Back home' },
  },
  failed: {
    ru: { title: 'Оплата не прошла', body: 'Банк отклонил платёж. Бронь сохранена, можно попробовать ещё раз — напиши нам на hello@forestretreat.lv.', cta: 'На главную' },
    lv: { title: 'Maksājums neizdevās', body: 'Banka noraidīja maksājumu. Rezervācija saglabāta, mēģini vēlreiz — raksti hello@forestretreat.lv.', cta: 'Uz sākumu' },
    en: { title: 'Payment failed',    body: 'The bank declined the payment. Your booking is saved — try again or email hello@forestretreat.lv.', cta: 'Back home' },
  },
};

export default async function PaymentReturn({ params, searchParams }) {
  const { locale } = await params;
  if (!LOCALES.includes(locale)) redirect('/ru');
  const sp = (await searchParams) || {};
  const ref = String(sp.payment_reference || '');

  let outcome = 'pending';
  let result = null;
  if (ref) {
    result = await refreshPaymentStatus(ref);
    if (result?.ok) {
      const ps = (result.payment_state || '').toLowerCase();
      if (ps === 'settled' || ps === 'authorized') outcome = 'paid';
      else if (ps === 'failed' || ps === 'abandoned' || ps === 'voided') outcome = 'failed';
      else outcome = 'pending';
    }
  } else {
    outcome = 'failed';
  }

  // If the visitor already has a session AND payment is settled, send them
  // straight to the dashboard with a welcome banner.
  if (outcome === 'paid') {
    const user = await getCurrentUser();
    if (user) redirect(`/${locale}/account?welcome=1`);
  }

  const copy = COPY[outcome][locale] || COPY[outcome].ru;
  const accountHref = `/${locale}/account/login`;

  return (
    <main className="payment-return">
      <div className="payment-return-card">
        <div className={`payment-return-icon payment-return-${outcome}`}>
          {outcome === 'paid' && '✓'}
          {outcome === 'pending' && '⌛'}
          {outcome === 'failed' && '✕'}
        </div>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <Link href={`/${locale}`} className="btn btn-primary">{copy.cta}</Link>
        <Link href={accountHref} className="payment-return-secondary">Войти в кабинет →</Link>
        {result?.booking && (
          <p className="payment-return-meta">
            ID: <code>{result.booking.id.slice(0, 8)}…</code>
          </p>
        )}
      </div>
    </main>
  );
}
