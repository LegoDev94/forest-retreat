import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function pluralNight(n) {
  const m = Math.abs(n) % 100, m2 = m % 10;
  if (m > 10 && m < 20) return 'ночей';
  if (m2 > 1 && m2 < 5) return 'ночи';
  if (m2 === 1) return 'ночь';
  return 'ночей';
}

const today = () => new Date().toISOString().slice(0, 10);
const offset = (days) => {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export default function BookingForm({ cottage }) {
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

  const onCheckInChange = (e) => {
    const v = e.target.value;
    setCheckIn(v);
    if (new Date(checkOut) <= new Date(v)) {
      const next = new Date(v); next.setDate(next.getDate() + 1);
      setCheckOut(next.toISOString().slice(0, 10));
    }
  };

  const onSubmit = (e) => { e.preventDefault(); setSuccess(true); };

  return (
    <>
      <div className="booking-card glass-premium" id="booking">
        <div className="booking-price">
          <span className="booking-price-num">{cottage.pricePerNight}</span>
          <span className="booking-price-unit">€ / ночь</span>
        </div>

        <form className="booking-form" onSubmit={onSubmit}>
          <div className="bf-row">
            <div className="bf-field">
              <label>Заезд</label>
              <input type="date" min={today()} value={checkIn} onChange={onCheckInChange} required />
            </div>
            <div className="bf-field">
              <label>Выезд</label>
              <input type="date" min={checkIn} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
            </div>
          </div>
          <div className="bf-field">
            <label>Гостей</label>
            <select value={guests} onChange={(e) => setGuests(e.target.value)}>
              <option value="1">1 гость</option>
              <option value="2">2 гостя</option>
              <option value="3">3 гостя</option>
              <option value="4">4 гостя</option>
            </select>
          </div>
          <div className="bf-field">
            <label>Имя</label>
            <input type="text" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="bf-row">
            <div className="bf-field">
              <label>E-mail</label>
              <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="bf-field">
              <label>Телефон</label>
              <input type="tel" placeholder="+371…" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>

          <div className="booking-summary">
            <div className="booking-summary-row">
              <span>{cottage.pricePerNight} € × {summary.nights} {pluralNight(summary.nights)}</span>
              <span>{summary.base} €</span>
            </div>
            <div className="booking-summary-row"><span>Уборка</span><span>30 €</span></div>
            <div className="booking-summary-row"><span>Сервисный сбор</span><span>{summary.fee} €</span></div>
            <div className="booking-summary-total">Итого <strong>{summary.total} €</strong></div>
          </div>

          <button type="submit" className="book-btn">Забронировать сейчас</button>
          <p className="book-help">Без предоплаты · Бесплатная отмена</p>
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
              <h3>Заявка отправлена!</h3>
              <p>Мы свяжемся с вами в течение часа, чтобы подтвердить бронирование. Спасибо, что выбрали Forest Retreat.</p>
              <button className="btn btn-primary" onClick={() => setSuccess(false)}>Прекрасно</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
