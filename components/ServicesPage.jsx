'use client';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useT, DICT } from '../lib/i18n.jsx';
import DateField from './DateField';
import Reveal from './Reveal';
import Icon from './Icon';
import { createServiceBooking } from '../app/actions/service-booking';
import { LIMITS, quoteService } from '../lib/services';

const todayISO = () => new Date().toISOString().slice(0, 10);

// Visual catalog — image + price chip + accent for each service
const CATALOG = [
  {
    kind: 'deer_ticket',
    photo: '/content/deer-park/photo/29157100.jpg',
    photoAlt: '/content/deer-park/photo/14138716.jpg',
    priceChip: '10 €',
    priceUnit: { ru: '/ чел · день', lv: '/ cilv. · diena', en: '/ pers · day' },
    accent: '#c9a86a',
    initial: { quantity: 2 },
  },
  {
    kind: 'picnic_kit',
    photo: '/content/picnic/photo/grill-deer.jpeg',
    photoAlt: '/content/deer-park/photo/4074167.jpg',
    priceChip: '10 €',
    priceUnit: { ru: '/ час · или 50 €/сутки', lv: '/ stunda · vai 50 €/dn', en: '/ hour · or €50/day' },
    accent: '#d4a574',
    initial: { quantity: 1, mode: 'hour', hours: 2, startTime: '12:00' },
  },
  {
    kind: 'tent',
    photo: '/content/fishing/photo/1850532.jpg',
    photoAlt: '/content/fishing/photo/9553530.jpg',
    priceChip: '20 €',
    priceUnit: { ru: '/ сутки', lv: '/ diennakts', en: '/ day' },
    accent: '#9bbf95',
    initial: { quantity: 1, days: 1 },
  },
  {
    kind: 'jacuzzi',
    photo: '/content/spa/photo/9890737.jpg',
    photoAlt: '/content/spa/photo/8968781.jpg',
    priceChip: '70 €',
    priceUnit: { ru: '/ сеанс · 3 часа', lv: '/ sesija · 3 h', en: '/ session · 3 h' },
    accent: '#e0c585',
    initial: { quantity: 1, startTime: '19:00' },
  },
  {
    kind: 'sauna',
    photo: '/content/spa/photo/8968781.jpg',
    photoAlt: '/content/spa/photo/9890737.jpg',
    priceChip: '30 €',
    priceUnit: { ru: '/ сеанс · 3 часа', lv: '/ sesija · 3 h', en: '/ session · 3 h' },
    accent: '#c9a86a',
    initial: { quantity: 1, startTime: '18:00' },
  },
];

// ------------------------------------------------------------
// PARALLAX HERO with floating price chips
// ------------------------------------------------------------
function ServicesHero({ onJump }) {
  const { t, locale, pick } = useT();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);

  return (
    <section className="svc-hero" ref={ref}>
      <motion.div className="svc-hero-bg" style={{ y: bgY }} />
      <div className="svc-hero-veil" />
      <motion.div className="svc-hero-content" style={{ y: contentY, opacity: contentOpacity }}>
        <motion.span
          className="svc-hero-eyebrow"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {t('services.eyebrow')}
        </motion.span>
        <motion.h1
          className="svc-hero-title"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {t('services.titleA')} <em>{t('services.titleAccent')}</em>{' '}{t('services.titleB')}
        </motion.h1>
        <motion.p
          className="svc-hero-lead"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {t('services.sub')}
        </motion.p>

        <motion.div
          className="svc-hero-chips"
          initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } } }}
        >
          {CATALOG.map((c) => {
            const item = DICT.services.items[c.kind];
            return (
              <motion.button
                type="button"
                key={c.kind}
                className="svc-hero-chip"
                onClick={() => onJump(c.kind)}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.92 },
                  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <span className="svc-hero-chip-emoji">{item.emoji}</span>
                <span className="svc-hero-chip-name">{pick(item.title)}</span>
                <span className="svc-hero-chip-price">{c.priceChip}</span>
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div
          className="svc-hero-card-note"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.7 }}
        >
          {t('services.cardOnSite')}
        </motion.div>
      </motion.div>

      <div className="svc-hero-scroll-hint">{t('hero.scroll')}</div>
    </section>
  );
}

// ------------------------------------------------------------
// ONE EDITORIAL SERVICE PANEL — alternating left / right
// ------------------------------------------------------------
function ServicePanel({ entry, index, onBook }) {
  const { locale, pick } = useT();
  const reverse = index % 2 === 1;
  const item = DICT.services.items[entry.kind];

  return (
    <Reveal className={`svc-panel${reverse ? ' reverse' : ''}`} id={`svc-${entry.kind}`}>
      <div className="svc-panel-visual">
        <motion.div
          className="svc-panel-photo"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          <img src={entry.photo} alt={pick(item.title)} loading="lazy" />
          <div className="svc-panel-photo-vignette" />
          <motion.div
            className="svc-panel-price-tag"
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ '--svc-accent': entry.accent }}
          >
            <span className="svc-panel-price-amount">{entry.priceChip}</span>
            <span className="svc-panel-price-unit">{pick(entry.priceUnit)}</span>
          </motion.div>
        </motion.div>
        <div className="svc-panel-photo-stack">
          <img src={entry.photoAlt} alt="" loading="lazy" />
        </div>
      </div>

      <div className="svc-panel-text">
        <span className="section-eyebrow">{item.emoji} {pick(item.subtitle)}</span>
        <h2 className="svc-panel-title">{pick(item.title)}</h2>
        <p className="svc-panel-desc">{pick(item.desc)}</p>

        <ul className="svc-panel-bullets">
          {entry.kind === 'deer_ticket' && (
            <>
              <li>🦌 {{ru:'Безлимит на день — заходи сколько хочешь',lv:'Bez limita visu dienu — ej iekšā cik gribi',en:'Unlimited all day — come and go any time'}[locale]}</li>
              <li>🥕 {{ru:'Корм для оленей — бесплатно',lv:'Barība briežiem — bez maksas',en:'Deer food — free at the counter'}[locale]}</li>
              <li>⏰ {{ru:'Парк работает 8:00–22:00',lv:'Parks atvērts 8:00–22:00',en:'Park hours 8:00–22:00'}[locale]}</li>
            </>
          )}
          {entry.kind === 'picnic_kit' && (
            <>
              <li>🔥 {{ru:'Мангал, уголь, решётка — выдаём бесплатно',lv:'Grils, ogles, režģis — bez maksas',en:'Grill, charcoal, grate — on us'}[locale]}</li>
              <li>⛺ {{ru:'Тент от солнца и дождя',lv:'Telts no saules un lietus',en:'Canopy against sun and rain'}[locale]}</li>
              <li>🦌 {{ru:'Олени подходят сами — без ограждений',lv:'Brieži paši pienāk — bez žogiem',en:'Deer come over by themselves'}[locale]}</li>
            </>
          )}
          {entry.kind === 'tent' && (
            <>
              <li>🏕 {{ru:'Своё место у озера или у парка',lv:'Sava vieta pie ezera vai parka',en:'Your spot by the lake or the park'}[locale]}</li>
              <li>🚿 {{ru:'Доступ к санузлу и душу',lv:'Pieeja sanmezglam un dušai',en:'Bathroom & shower included'}[locale]}</li>
              <li>🔥 {{ru:'Огонь только в наших мангалах',lv:'Uguns tikai mūsu grilos',en:'Fire allowed only in our grills'}[locale]}</li>
            </>
          )}
          {entry.kind === 'jacuzzi' && (
            <>
              <li>♨️ {{ru:'39° тёплой воды под открытым небом',lv:'39° silta ūdens zem klajas debess',en:'39° water under the open sky'}[locale]}</li>
              <li>🌌 {{ru:'Звёздное небо и тишина леса',lv:'Zvaigžņota debess un meža klusums',en:'Star-filled sky, forest silence'}[locale]}</li>
              <li>🧖 {{ru:'Полотенца и подготовка — на нас',lv:'Dvieļi un sagatavošana — uz mums',en:'Towels and setup included'}[locale]}</li>
            </>
          )}
          {entry.kind === 'sauna' && (
            <>
              <li>🔥 {{ru:'Финская сауна с ароматом дерева',lv:'Somu pirts ar koka aromātu',en:'Finnish sauna, pine aroma'}[locale]}</li>
              <li>🥶 {{ru:'Холодная купель в озере — в двух шагах',lv:'Auksta peldvieta ezerā — divos soļos',en:'Cold dip in the lake — two steps away'}[locale]}</li>
              <li>🌿 {{ru:'Веники и полотенца на стойке',lv:'Slotas un dvieļi pie reģistratūras',en:'Birch whisks & towels at the counter'}[locale]}</li>
            </>
          )}
        </ul>

        <button type="button" className="svc-panel-cta" onClick={() => onBook(entry.kind)}>
          <span>{DICT.services.fields.submit[locale] || 'Book by card'}</span>
          <Icon name="arrowRight" size={16} stroke={2.4} />
        </button>
      </div>
    </Reveal>
  );
}

// ------------------------------------------------------------
// BOOKING MODAL — pulls the right selector layout per service
// ------------------------------------------------------------
function BookingModal({ kind, onClose }) {
  const { t, locale, pick } = useT();
  const entry = CATALOG.find((c) => c.kind === kind);
  const item = DICT.services.items[kind];

  const [form, setForm] = useState(() => ({ ...entry.initial }));
  const [serviceDate, setServiceDate] = useState('');
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [payUrl, setPayUrl] = useState('');
  const [pending, startTransition] = useTransition();

  const onChange = (patch) => setForm((p) => ({ ...p, ...patch }));
  const linePrice = useMemo(() => quoteService({ kind, ...form }), [kind, form]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setErrMsg('');
    if (!serviceDate) { setErrMsg(t('services.fields.requiredErr')); return; }
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrMsg(t('services.fields.requiredErr'));
      return;
    }
    if (!consent) { setErrMsg(t('booking.consentRequired')); return; }

    startTransition(async () => {
      const result = await createServiceBooking({
        kind,
        serviceDate,
        quantity:    form.quantity,
        mode:        form.mode,
        hours:       form.hours,
        days:        form.days,
        startTime:   form.startTime || null,
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
    <motion.div
      className="svc-modal"
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="svc-modal-card glass-premium"
        initial={{ y: 50, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <button type="button" className="svc-modal-close" onClick={onClose} aria-label="Close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>

        <div className="svc-modal-head">
          <div className="svc-modal-emoji" style={{ background: `linear-gradient(135deg, ${entry.accent}, var(--accent-2))` }}>
            {item.emoji}
          </div>
          <div>
            <span className="section-eyebrow">{pick(item.subtitle)}</span>
            <h3 className="svc-modal-title">{pick(item.title)}</h3>
          </div>
        </div>

        {success ? (
          <div className="svc-modal-success">
            <div className="modal-icon">✓</div>
            <h4>{t('booking.successTitle')}</h4>
            <p>{t('services.fields.success')}</p>
            {payUrl ? (
              <a className="btn btn-primary" href={payUrl}>{t('booking.payNow')} · {linePrice} €</a>
            ) : (
              <button className="btn btn-primary" onClick={onClose}>{t('booking.successBtn')}</button>
            )}
          </div>
        ) : (
          <form className="svc-modal-form" onSubmit={onSubmit}>
            {/* Per-kind selectors */}
            {kind === 'deer_ticket' && (
              <div className="svc-modal-row">
                <div className="svc-modal-field">
                  <label>{t('services.fields.quantity')} · {t('services.fields.persons')}</label>
                  <div className="svc-stepper">
                    <button type="button" onClick={() => onChange({ quantity: Math.max(1, form.quantity - 1) })}>−</button>
                    <span>{form.quantity}</span>
                    <button type="button" onClick={() => onChange({ quantity: Math.min(LIMITS.deer_ticket.qtyMax, form.quantity + 1) })}>+</button>
                  </div>
                </div>
              </div>
            )}

            {kind === 'picnic_kit' && (
              <>
                <div className="svc-modal-toggles">
                  <button
                    type="button"
                    className={`svc-tab${form.mode === 'hour' ? ' on' : ''}`}
                    onClick={() => onChange({ mode: 'hour' })}
                  >
                    <strong>{t('services.fields.pickHours')}</strong>
                    <span>10 €/{t('services.fields.hour')}</span>
                  </button>
                  <button
                    type="button"
                    className={`svc-tab${form.mode === 'day' ? ' on' : ''}`}
                    onClick={() => onChange({ mode: 'day' })}
                  >
                    <strong>{t('services.fields.orDay')}</strong>
                    <span>50 €/{t('services.fields.day')}</span>
                  </button>
                </div>
                {form.mode === 'hour' && (
                  <div className="svc-modal-field">
                    <label>{t('services.fields.pickHours')}</label>
                    <div className="svc-hours-grid">
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((h) => (
                        <button
                          key={h}
                          type="button"
                          className={`svc-hour-pill${form.hours === h ? ' on' : ''}`}
                          onClick={() => onChange({ hours: h })}
                        >
                          {h} {t('services.fields.hour')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="svc-modal-row">
                  <div className="svc-modal-field">
                    <label>{t('services.fields.start')}</label>
                    <input
                      type="time"
                      value={form.startTime || '12:00'}
                      onChange={(e) => onChange({ startTime: e.target.value })}
                    />
                  </div>
                  <div className="svc-modal-field">
                    <label>{t('services.fields.quantity')}</label>
                    <div className="svc-stepper">
                      <button type="button" onClick={() => onChange({ quantity: Math.max(1, form.quantity - 1) })}>−</button>
                      <span>{form.quantity}</span>
                      <button type="button" onClick={() => onChange({ quantity: Math.min(LIMITS.picnic_kit.qtyMax, form.quantity + 1) })}>+</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {kind === 'tent' && (
              <div className="svc-modal-row">
                <div className="svc-modal-field">
                  <label>{t('services.fields.nights')}</label>
                  <div className="svc-stepper">
                    <button type="button" onClick={() => onChange({ days: Math.max(1, form.days - 1) })}>−</button>
                    <span>{form.days}</span>
                    <button type="button" onClick={() => onChange({ days: Math.min(LIMITS.tent.daysMax, form.days + 1) })}>+</button>
                  </div>
                </div>
                <div className="svc-modal-field">
                  <label>{t('services.fields.quantity')}</label>
                  <div className="svc-stepper">
                    <button type="button" onClick={() => onChange({ quantity: Math.max(1, form.quantity - 1) })}>−</button>
                    <span>{form.quantity}</span>
                    <button type="button" onClick={() => onChange({ quantity: Math.min(LIMITS.tent.qtyMax, form.quantity + 1) })}>+</button>
                  </div>
                </div>
              </div>
            )}

            {(kind === 'jacuzzi' || kind === 'sauna') && (
              <div className="svc-modal-row">
                <div className="svc-modal-field">
                  <label>{t('services.fields.start')}</label>
                  <input
                    type="time"
                    value={form.startTime || (kind === 'jacuzzi' ? '19:00' : '18:00')}
                    onChange={(e) => onChange({ startTime: e.target.value })}
                  />
                </div>
                <div className="svc-modal-field">
                  <label>{t('services.fields.sessions')}</label>
                  <div className="svc-stepper">
                    <button type="button" onClick={() => onChange({ quantity: Math.max(1, form.quantity - 1) })}>−</button>
                    <span>{form.quantity}</span>
                    <button type="button" onClick={() => onChange({ quantity: Math.min(LIMITS[kind].qtyMax, form.quantity + 1) })}>+</button>
                  </div>
                </div>
              </div>
            )}

            <DateField
              label={t('services.fields.date')}
              value={serviceDate}
              onChange={setServiceDate}
              minDate={todayISO()}
              fieldClassName="svc-modal-field"
              align="left"
            />

            <div className="svc-modal-field">
              <label>{t('services.fields.name')}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="svc-modal-row">
              <div className="svc-modal-field">
                <label>{t('services.fields.email')}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
              </div>
              <div className="svc-modal-field">
                <label>{t('services.fields.phone')}</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+371…" required />
              </div>
            </div>
            <div className="svc-modal-field">
              <label>{t('services.fields.notes')}</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('services.fields.notesPh')}
              />
            </div>

            <div className="svc-modal-summary">
              <span>{t('services.fields.total')}</span>
              <strong>{linePrice} €</strong>
            </div>

            {errMsg && <div className="booking-error" role="alert">{errMsg}</div>}

            <label className="booking-consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
              <span>{consentLabel}</span>
            </label>

            <button type="submit" className="svc-modal-submit" disabled={pending || linePrice <= 0}>
              {pending ? t('services.fields.sending') : `${t('services.fields.submit')} · ${linePrice} €`}
            </button>
            <p className="svc-modal-hint">{t('services.cardOnSite')}</p>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ------------------------------------------------------------
// PAGE
// ------------------------------------------------------------
export default function ServicesPage() {
  const { t, locale, pick } = useT();
  const [modalKind, setModalKind] = useState(null);

  const jumpTo = (kind) => {
    const el = document.getElementById(`svc-${kind}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="services-page">
      <ServicesHero onJump={jumpTo} />

      <section className="section svc-panels">
        {CATALOG.map((entry, i) => (
          <ServicePanel
            key={entry.kind}
            entry={entry}
            index={i}
            onBook={(k) => setModalKind(k)}
          />
        ))}
      </section>

      {/* Trust footer — on-site card payments + security */}
      <section className="section svc-trust">
        <Reveal className="svc-trust-card glass-premium">
          <div className="svc-trust-row">
            <div className="svc-trust-item">
              <div className="svc-trust-icon">💳</div>
              <div>
                <strong>{t('services.onSiteBanner.title')}</strong>
                <p>{t('services.onSiteBanner.text')}</p>
              </div>
            </div>
            <div className="svc-trust-item">
              <div className="svc-trust-icon">🔒</div>
              <div>
                <strong>{pick({ ru:'Безопасная оплата', lv:'Droša apmaksa', en:'Secure payment' })}</strong>
                <p>{pick({
                  ru:'EveryPay × Swedbank · VISA / Mastercard · 3D Secure',
                  lv:'EveryPay × Swedbank · VISA / Mastercard · 3D Secure',
                  en:'EveryPay × Swedbank · VISA / Mastercard · 3D Secure',
                })}</p>
              </div>
            </div>
            <div className="svc-trust-item">
              <div className="svc-trust-icon">⏰</div>
              <div>
                <strong>{pick({ ru:'Гибкая отмена', lv:'Elastīga atcelšana', en:'Flexible cancellation' })}</strong>
                <p>{pick({
                  ru:'Бесплатно за 48 часов до начала',
                  lv:'Bez maksas 48 h pirms sākuma',
                  en:'Free up to 48 h before',
                })}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <AnimatePresence>
        {modalKind && (
          <BookingModal kind={modalKind} onClose={() => setModalKind(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
