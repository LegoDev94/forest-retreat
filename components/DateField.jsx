'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DICT, useLocale } from '../lib/i18n.jsx';

const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startOffset = (first.getDay() + 6) % 7; // Mon = 0
  const days = [];
  for (let i = startOffset; i > 0; i--) days.push(new Date(year, month, 1 - i));
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(new Date(year, month + 1, days.length - last.getDate() - startOffset + 1));
  return days;
}

const LOCALE_TAG = { ru: 'ru-RU', lv: 'lv-LV', en: 'en-GB' };

function formatDisplay(value, locale) {
  if (!value) return '—';
  const d = fromISO(value);
  return d.toLocaleDateString(LOCALE_TAG[locale] || 'ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function DateField({ label, value, onChange, minDate, fieldClassName = 'search-field', align = 'left' }) {
  const { locale } = useLocale();
  const MONTHS = DICT.months[locale];
  const WEEKDAYS = DICT.weekdays[locale];
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const d = value ? fromISO(value) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // When opening, jump view to the selected date
  useEffect(() => {
    if (open && value) {
      const d = fromISO(value);
      setView({ year: d.getFullYear(), month: d.getMonth() });
    }
  }, [open, value]);

  const today = startOfDay(new Date());
  const min = minDate ? startOfDay(fromISO(minDate)) : null;
  const sel = value ? fromISO(value) : null;
  const days = buildMonthGrid(view.year, view.month);

  const select = (d) => { onChange(toISO(d)); setOpen(false); };
  const goPrev = (e) => { e.stopPropagation(); setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }); };
  const goNext = (e) => { e.stopPropagation(); setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }); };

  return (
    <div
      ref={ref}
      className={`${fieldClassName} datefield ${open ? 'open' : ''}`}
      onClick={() => setOpen(o => !o)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o); } }}
    >
      <label>{label}</label>
      <div className="datefield-display">
        <span>{formatDisplay(value, locale)}</span>
        <svg className="datefield-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className={`datepicker datepicker-${align}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="datepicker-head">
              <button type="button" className="datepicker-nav" onClick={goPrev} aria-label="Предыдущий месяц">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <span className="datepicker-month">{MONTHS[view.month]} <em>{view.year}</em></span>
              <button type="button" className="datepicker-nav" onClick={goNext} aria-label="Следующий месяц">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>

            <div className="datepicker-weekdays">
              {WEEKDAYS.map(w => <span key={w}>{w}</span>)}
            </div>

            <div className="datepicker-grid">
              {days.map((d, i) => {
                const otherMonth = d.getMonth() !== view.month;
                const isToday = sameDay(d, today);
                const isSel = sel && sameDay(d, sel);
                const disabled = min && d < min;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={(e) => { e.stopPropagation(); if (!disabled) select(d); }}
                    className={`datepicker-day${otherMonth ? ' other' : ''}${isToday ? ' today' : ''}${isSel ? ' sel' : ''}`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}