'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { LocaleLink as Link } from '../lib/i18n.jsx';
import { COTTAGES, photoUrl } from '../lib/data';
import { useT } from '../lib/i18n.jsx';
import Icon from './Icon';

export default function MegaMenu({ open, onClose, onMouseEnter, onMouseLeave }) {
  const { t, pick } = useT();

  return (
    <AnimatePresence>
      {open && (
        <div
          className="mega-menu-portal"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <motion.div
            className="mega-menu"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="mega-menu-head">
              <span className="mega-eyebrow">{t('mega.eyebrow')}</span>
              <span className="mega-counter">{`01 → 0${COTTAGES.length}`}</span>
            </div>

            <motion.div
              className="mega-grid"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
            >
              {COTTAGES.map((c, i) => (
                <motion.div
                  key={c.id}
                  variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <Link
                    href={`/cottage/${c.id}`}
                    className="mega-card"
                    onClick={onClose}
                  >
                    <div className="mega-card-num">{`0${i + 1}`}</div>
                    <div className="mega-card-img">
                      <img src={photoUrl(c, c.photos[0])} alt={pick(c.name)} loading="lazy" />
                    </div>
                    <div className="mega-card-info">
                      <span className="mega-card-badge">{pick(c.badge)}</span>
                      <h4 className="mega-card-name">{pick(c.name)}</h4>
                      <p className="mega-card-tagline">{pick(c.tagline)}</p>
                      <div className="mega-card-meta">
                        <span className="mega-card-price">
                          <strong>{c.pricePerNight}€</strong>{' '}
                          <span>{t('cottages.perNight')}</span>
                        </span>
                        <span className="mega-card-rating">★ {c.rating}</span>
                      </div>
                    </div>
                    <Icon name="arrowRight" size={16} className="mega-card-arrow" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <div className="mega-menu-foot">
              <span>{t('mega.footHint')}</span>
              <a href="/#cottages" className="mega-foot-link" onClick={onClose}>
                {t('mega.viewAll')} <Icon name="arrowRight" size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}