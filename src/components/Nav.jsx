import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../i18n.jsx';
import LanguageSwitcher from './LanguageSwitcher';

export default function Nav({ alwaysScrolled = false }) {
  const { t } = useT();
  const [scrolled, setScrolled] = useState(alwaysScrolled);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (alwaysScrolled) return;
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [alwaysScrolled]);

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="logo">
          <span className="logo-mark" />
          <span className="logo-name">Forest <span>Retreat</span></span>
        </Link>
        <div className="nav-links">
          <a href="/#cottages">{t('nav.cottages')}</a>
          <a href="/#why">{t('nav.why')}</a>
          <a href="/#reviews">{t('nav.reviews')}</a>
          <a href="/#contact">{t('nav.contact')}</a>
        </div>
        <div className="nav-actions">
          <LanguageSwitcher />
          <a href="/#cottages" className="nav-cta">{t('nav.book')}</a>
        </div>
        <button className="nav-burger" aria-label={t('nav.menu')} onClick={() => setOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <a href="/#cottages">{t('nav.cottages')}</a>
            <a href="/#why">{t('nav.why')}</a>
            <a href="/#reviews">{t('nav.reviews')}</a>
            <a href="/#contact">{t('nav.contact')}</a>
            <div onClick={(e) => e.stopPropagation()}><LanguageSwitcher /></div>
            <a href="/#cottages" className="btn btn-primary">{t('nav.book')}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
