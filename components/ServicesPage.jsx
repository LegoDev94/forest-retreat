'use client';
import { useMemo, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT, DICT } from '../lib/i18n.jsx';
import DateField from './DateField';
import Reveal from './Reveal';
import Icon from './Icon';
import { createServiceBooking } from '../app/actions/service-booking';
import { LIMITS, quoteService } from '../lib/services';

const todayISO = () => new Date().toISOString().slice(0, 10);

const KINDS = ['deer_ticket', 'picnic_kit', 'tent', 'jacuzzi', 'sauna'];

// Initial per-kind form state — kept in one object so a single state hook works.
function initialForms() {
  return {
    deer_ticket: { quantity: 2 },
    picnic_kit:  { quantity: 1, mode: 'hour', hours: 2 },
    tent:        { quantity: 1, days: 1 },
    jacuzzi:     { quantity: 1, startTime: '19:00' },
    sauna:       { quantity: 1, startTime: '18:00' },
  };
}

function ServiceCard({ kind, locale, t, pick, selected, onSelect, form, onChange }) {
  const item = DICT.services.items[kind];
  const price = quoteService({ kind, ...form });
  return (
    <button
      type="button"
      className={`svc-card${selected ? ' selected' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <div className="svc-card-head">
        <span className="svc-card-emoji">{item.emoji}</span>
        <div className="svc-card-titles">
          <div className="svc-card-title">{pick(item.title)}</div>
          <div className="svc-card-sub">{pick(item.subtitle)}</div>
        </div>
        <div className="svc-card-price">
          {pick(item.price || item.priceHour)}
          {item.priceDay && <small> · {pick(item.priceDay)}</small>}
        </div>
      </div>
      <p className="svc-card-desc">{pick(item.desc)}</p>

      {selected && (
        <div className="svc-card-controls" onClick={(e) => e.stopPropagation()}>
          {kind === 'deer_ticket' && (
            <div className="svc-row">
              <label className="svc-field">
                <span>{t('services.fields.quantity')}</span>
                <input
                  type="number" min={LIMITS.deer_ticket.qtyMin} max={LIMITS.deer_ticket.qtyMax}
                  value={form.quantity}
                  onChange={(e) => onChange({ quantity: Math.max(1, Number(e.target.value) || 1) })}
                />
                <em>{t('services.fields.persons')}</em>
              </label>
            </div>
          )}

          {kind === 'picnic_kit' && (
            <>
              <div className="svc-row">
                <label className="svc-toggle">
                  <input
                    type="radio" name={`pk-mode-${kind}`} value="hour"
                    checked={form.mode === 'hour'}
                    onChange={() => onChange({ mode: 'hour' })}
                  />
                  <span>{t('services.fields.pickHours')} · 10 €/{t('services.fields.hour')}</span>
                </label>
                <label className="svc-toggle">
                  <input
                    type="radio" name={`pk-mode-${kind}`} value="day"
                    checked={form.mode === 'day'}
                    onChange={() => onChange({ mode: 'day' })}
                  />
                  <span>{t('services.fields.orDay')} · 50 €/{t('services.fields.day')}</span>
                </label>
              </div>
              {form.mode === 'hour' && (
                <div className="svc-hours">
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((h) => (
                    <label key={h} className={`svc-chip${form.hours === h ? ' on' : ''}`}>
                      <input
                        type="checkbox"
                        checked={form.hours === h}
                        onChange={() => onChange({ hours: h })}
                      />
                      <span>{h} {t('services.fields.hour')}</span>
                    </label>
                  ))}
                </div>
              )}
              <div className="svc-row">
                <label className="svc-field">
                  <span>{t('services.fields.start')}</span>
                  <input
                    type="time"
                    value={form.startTime || '12:00'}
                    onChange={(e) => onChange({ startTime: e.target.value })}
                  />
                </label>
                <label className="svc-field">
                  <span>{t('services.fields.quantity')}</span>
                  <input
                    type="number" min={1} max={LIMITS.picnic_kit.qtyMax}
                    value={form.quantity}
                    onChange={(e) => onChange({ quantity: Math.max(1, Number(e.target.value) || 1) })}
                  />
                </label>
              </div>
            </>
          )}

          {kind === 'tent' && (
            <div className="svc-row">
              <label className="svc-field">
                <span>{t('services.fields.nights')}</span>
                <input
                  type="number" min={1} max={LIMITS.tent.daysMax}
                  value={form.days}
                  onChange={(e) => onChange({ days: Math.max(1, Number(e.target.value) || 1) })}
                />
              </label>
              <label className="svc-field">
                <span>{t('services.fields.quantity')}</span>
                <input
                  type="number" min={1} max={LIMITS.tent.qtyMax}
                  value={form.quantity}
                  onChange={(e) => onChange({ quantity: Math.max(1, Number(e.target.value) || 1) })}
                />
              </label>
            </div>
          )}

          {(kind === 'jacuzzi' || kind === 'sauna') && (
            <div className="svc-row">
              <label className="svc-field">
                <span>{t('services.fields.start')}</span>
                <input
                  type="time"
                  value={form.startTime || (kind === 'jacuzzi' ? '19:00' : '18:00')}
                  onChange={(e) => onChange({ startTime: e.target.value })}
                />
              </label>
              <label className="svc-field">
                <span>{t('services.fields.sessions')}</span>
                <input
                  type="number" min={1} max={LIMITS[kind].qtyMax}
                  value={form.quantity}
                  onChange={(e) => onChange({ quantity: Math.max(1, Number(e.target.value) || 1) })}
                />
              </label>
            </div>
          )}

          <div className="svc-line-total">
            {t('services.fields.total')} <strong>{price} €</strong>
          </div>
        </div>
      )}
    </button>
  );
}

export default function ServicesPage() {
  const { t, locale, pick } = useT();
  const [selected, setSelected] = useState('deer_ticket');
  const [forms, setForms] = useState(initialForms);
  const [serviceDate, setServiceDate] = useState('');
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [errMsg, setErrMsg]   = useState('');
  const [success, setSuccess] = useState(false);
  const [payUrl, setPayUrl]   = useState('');
  const [pending, startTransition] = useTransition();

  const onChangeForm = (kind, patch) => {
    setForms((prev) => ({ ...prev, [kind]: { ...prev[kind], ...patch } }));
  };

  const linePrice = useMemo(
    () => quoteService({ kind: selected, ...forms[selected] }),
    [selected, forms]
  );

  const onSubmit = (e) => {
    e.preventDefault();
    setErrMsg('');
    if (!serviceDate) { setErrMsg(t('services.fields.requiredErr')); return; }
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrMsg(t('services.fields.requiredErr'));
      return;
    }
    if (!consent) { setErrMsg(t('booking.consentRequired')); return; }

    const f = forms[selected];
    startTransition(async () => {
      const result = await createServiceBooking({
        kind:        selected,
        serviceDate,
        quantity:    f.quantity,
        mode:        f.mode,
        hours:       f.hours,
        days:        f.days,
        startTime:   f.startTime || null,
        name, email, phone, notes,
        locale,
      });
      if (!result.ok) {
        setErrMsg(result.message || t('services.fields.errGeneric'));
        return;
      }
      setSuccess(true);
      if (result.pay_url) setPayUrl(result.pay_url);
    });
  };

  const consentLabel = (() => {
    const parts = (t('services.fields.consentLabel') || '').split(/\{(terms|privacy|refund)\}/);
    return parts.map((p, i) => {
      if (p === 'terms')   return <a key={i} href={`/${locale}/legal/terms`}   target="_blank" rel="noopener">{t('booking.consentTerms')}</a>;
      if (p === 'privacy') return <a key={i} href={`/${locale}/legal/privacy`} target="_blank" rel="noopener">{t('booking.consentPrivacy')}</a>;
      if (p === 'refund')  return <a key={i} href={`/${locale}/legal/refund`}  target="_blank" rel="noopener">{t('booking.consentRefund')}</a>;
      return <span key={i}>{p}</span>;
    });
  })();

  return (
    <main className="services-page">
      <section className="section services-hero">
        <Reveal>
          <span className="section-eyebrow">{t('services.eyebrow')}</span>
          <h1 className="section-title">
            {t('services.titleA')} <em>{t('services.titleAccent')}</em>{' '}{t('services.titleB')}
          </h1>
          <p className="section-sub">{t('services.sub')}</p>
          <div className="svc-card-onsite">{t('services.cardOnSite')}</div>
        </Reveal>
      </section>

      <section className="section services-grid-wrap">
        <Reveal className="services-grid">
          {KINDS.map((kind) => (
            <ServiceCard
              key={kind}
              kind={kind}
              locale={locale}
              t={t}
              pick={pick}
              selected={selected === kind}
              onSelect={() => setSelected(kind)}
              form={forms[kind]}
              onChange={(patch) => onChangeForm(kind, patch)}
            />
          ))}
        </Reveal>
      </section>

      <section className="section services-form-wrap" id="svc-form">
        <Reveal className="services-form-card glass-premium">
          <h2 className="services-form-title">
            {DICT.services.items[selected].emoji} {pick(DICT.services.items[selected].title)}
          </h2>
          <form className="booking-form" onSubmit={onSubmit}>
            <div className="bf-row">
              <DateField
                label={t('services.fields.date')}
                value={serviceDate}
                onChange={setServiceDate}
                minDate={todayISO()}
                fieldClassName="bf-field"
                align="left"
              />
              <div className="bf-field">
                <label>{t('services.fields.total')}</label>
                <div className="svc-total-readout">{linePrice} €</div>
              </div>
            </div>
            <div className="bf-field">
              <label>{t('services.fields.name')}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="bf-row">
              <div className="bf-field">
                <label>{t('services.fields.email')}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
              </div>
              <div className="bf-field">
                <label>{t('services.fields.phone')}</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+371…" required />
              </div>
            </div>
            <div className="bf-field">
              <label>{t('services.fields.notes')}</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('services.fields.notesPh')}
              />
            </div>

            {errMsg && <div className="booking-error" role="alert">{errMsg}</div>}

            <label className="booking-consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
              <span>{consentLabel}</span>
            </label>

            <button type="submit" className="book-btn" disabled={pending || linePrice <= 0}>
              {pending ? t('services.fields.sending') : `${t('services.fields.submit')} · ${linePrice} €`}
            </button>
            <p className="book-help">{t('services.onSiteBanner.text')}</p>
          </form>
        </Reveal>
      </section>

      <AnimatePresence>
        {success && (
          <motion.div
            className="modal open"
            role="dialog"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
              <p>{t('services.fields.success')}</p>
              {payUrl ? (
                <a className="btn btn-primary" href={payUrl}>{t('booking.payNow')}</a>
              ) : (
                <button className="btn btn-primary" onClick={() => setSuccess(false)}>{t('booking.successBtn')}</button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
