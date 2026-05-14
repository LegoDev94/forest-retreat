'use client';
import { motion } from 'framer-motion';
import { useT, DICT, LocaleLink } from '../lib/i18n.jsx';
import Reveal from './Reveal';
import Icon from './Icon';

// Mirror the CATALOG in ServicesPage so the home preview never disagrees on
// price or photo. Duplicated intentionally — a shared module would couple a
// server-imported file ('use client' here) to the heavy form deps in
// ServicesPage and slow down the home-page bundle.
const TILES = [
  { kind: 'deer_ticket', photo: '/content/deer-park/photo/14138716.jpg', priceChip: '10 €',
    priceUnit: { ru: '/ чел · день', lv: '/ cilv. · diena', en: '/ pers · day' } },
  { kind: 'picnic_kit',  photo: '/content/picnic/photo/grill-deer.jpeg', priceChip: '10 €',
    priceUnit: { ru: '/ час · 50 €/сутки', lv: '/ stunda · 50 €/dn', en: '/ hour · €50/day' } },
  { kind: 'tent',        photo: '/content/fishing/photo/9553530.jpg',    priceChip: '20 €',
    priceUnit: { ru: '/ сутки', lv: '/ diennakts', en: '/ day' } },
  { kind: 'jacuzzi',     photo: '/content/spa/photo/9890737.jpg',        priceChip: '70 €',
    priceUnit: { ru: '/ 3 часа', lv: '/ 3 h', en: '/ 3 h' } },
  { kind: 'sauna',       photo: '/content/spa/photo/8968781.jpg',        priceChip: '30 €',
    priceUnit: { ru: '/ 3 часа', lv: '/ 3 h', en: '/ 3 h' } },
];

export default function ServicesShowcase() {
  const { t, pick } = useT();

  return (
    <section className="section svc-showcase" id="services-preview">
      <Reveal className="section-head">
        <span className="section-eyebrow">{t('services.eyebrow')}</span>
        <h2 className="section-title">
          {t('services.titleA')} <br />
          <em className="accent">{t('services.titleAccent')}</em>{' '}{t('services.titleB')}
        </h2>
        <p className="section-sub">{t('services.sub')}</p>
      </Reveal>

      <div className="svc-showcase-grid">
        {TILES.map((tile, i) => {
          const item = DICT.services.items[tile.kind];
          return (
            <motion.div
              key={tile.kind}
              className={`svc-tile svc-tile-${tile.kind}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <LocaleLink href={`/services#svc-${tile.kind}`} className="svc-tile-link">
                <div className="svc-tile-media">
                  <img src={tile.photo} alt={pick(item.title)} loading="lazy" />
                  <div className="svc-tile-veil" />
                  <div className="svc-tile-price">
                    <span className="svc-tile-price-amount">{tile.priceChip}</span>
                    <span className="svc-tile-price-unit">{pick(tile.priceUnit)}</span>
                  </div>
                </div>
                <div className="svc-tile-info">
                  <div className="svc-tile-emoji">{item.emoji}</div>
                  <div className="svc-tile-text">
                    <div className="svc-tile-title">{pick(item.title)}</div>
                    <div className="svc-tile-sub">{pick(item.subtitle)}</div>
                  </div>
                  <div className="svc-tile-arrow">
                    <Icon name="arrowRight" size={16} stroke={2.4} />
                  </div>
                </div>
              </LocaleLink>
            </motion.div>
          );
        })}
      </div>

      <Reveal className="svc-showcase-foot">
        <span>{t('services.cardOnSite')}</span>
        <LocaleLink href="/services" className="btn btn-primary">
          {pick({ ru: 'Все услуги', lv: 'Visi pakalpojumi', en: 'All services' })}
          <Icon name="arrowRight" size={14} stroke={2.4} />
        </LocaleLink>
      </Reveal>
    </section>
  );
}
