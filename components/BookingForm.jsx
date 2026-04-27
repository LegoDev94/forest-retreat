'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DateField from './DateField';
import { useT, DICT } from '../lib/i18n.jsx';

function pluralRu(n) {
  const m = Math.abs(n) % 100, m2 = m % 10;
  if (m > 10 && m < 20) return DICT.booking.nightsMany.ru;
  if (m2 > 1 && m2 < 5) return DICT.booking.nightsFew.ru;
  if (m2 === 1) return DICT.booking.nights1.ru;
  return DICT.booking.nightsMany.ru;
}

function pluralWord(n, locale) {
  if (locale === 'ru') return pluralRu(n);
  if (locale === 'lv') return n === 1 ? DICT.booking.nights1.lv : DICT.booking.nightsMany.lv;
  return n === 1 ? DICT.booking.nights1.en : DICT.booking.nightsMany.en;
}

const today = () => new Date().toISOString().slice(0, 10);
const offset = (days) => {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export default function BookingForm({ cottage }) {
  const { t, locale } = useT();
  const [checkIn, setCheckIn]   = useState(offset(3));
  const [checkOut, setCheckOut] = useState(offset(5));
  const [guests, setGuests]     = useState('2');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [success, setSuccess]   = useState(false);

  const summary = useMemo(() => {
    const d1 = new Date(checkIn), d2 = new Date(checkOut);
    const nights = Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
    const base = cottage.pricePerNight * nights;
    const fee  = Math.round(base * 0.06);
    const total = nights > 0 ? base + 30 + fee : 0;
    return { nights, base, fee, total };
  }, [checkIn, checkOut, cottage.pricePerNight]);

  const onCheckInChange = (v) => {
    setCheckIn(v);
    if (new Date(checkOut) <= new Date(v)) {
      const next = new Date(v); next.setDate(next.getDate() + 1);
      setCheckOut(next.toISOString().slice(0, 10));
    }
  };

  const onSubmit = (e) => { e.preventDefault(); setSuccess(true); };
  const guestOpts = DICT.guestsOptions[locale];

  return (
    <>
      <div className="booking-card glass-premium" id="booking">
        <div className="booking-price">
          <span className="booking-price-num">{cottage.pricePerNight}</span>
          <span className="booking-price-unit">{t('booking.perNight')}</span>
        </div>

        <form className="booking-form" onSubmit={onSubmit}>
          <div className="bf-row">
            <DateField
              label={t('booking.checkIn')}
              value={checkIn}
              onChange={onCheckInChange}
              minDate={today()}
              fieldClassName="bf-field"
              align="left"
            />
            <DateField
              label={t('booking.checkOut')}
              value={checkOut}
              onChange={setCheckOut}
              minDate={checkIn}
              fieldClassName="bf-field"
              align="right"
            />
          </div>
          <div className="bf-field">
            <label>{t('booking.guests')}</label>
            <select value={guests} onChange={(e) => setGuests(e.target.value)}>
              {guestOpts.map((opt, i) => <option key={i} value={i + 1}>{opt}</option>)}
            </select>
          </div>
          <div className="bf-field">
            <label>{t('booking.name')}</label>
            <input type="text" placeholder={t('booking.namePh')} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="bf-row">
            <div className="bf-field">
              <label>{t('booking.email')}</label>
              <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="bf-field">
              <label>{t('booking.phone')}</label>
              <input type="tel" placeholder="+371…" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>

          <div className="booking-summary">
            <div className="booking-summary-row">
              <span>{cottage.pricePerNight} € × {summary.nights} {pluralWord(summary.nights, locale)}</span>
              <span>{summary.base} €</span>
            </div>
            <div className="booking-summary-row"><span>{t('booking.cleaning')}</span><span>30 €</span></div>
            <div className="booking-summary-row"><span>{t('booking.fee')}</span><span>{summary.fee} €</span></div>
            <div className="booking-summary-total">{t('booking.total')} <strong>{summary.total} €</strong></div>
          </div>

          <button type="submit" className="book-btn">{t('booking.submit')}</button>
          <p className="book-help">{t('booking.helper')}</p>
        </form>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            className="modal open"
            role="dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setSuccess(false); }}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="modal-icon">✓</div>
              <h3>{t('booking.successTitle')}</h3>
              <p>{t('booking.successText')}</p>
              <button className="btn btn-primary" onClick={() => setSuccess(false)}>{t('booking.successBtn')}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}