import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../i18n.jsx';
import { COTTAGES, photoUrl } from '../data';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';
import MegaMenu from './MegaMenu';
import Icon from './Icon';
import useMagnetic from '../hooks/useMagnetic';

const SECTIONS = ['cottages', 'why', 'reviews', 'contact'];

export default function Nav({ alwaysScrolled = false }) {
  const { t } = useT();
  const [scrolled, setScrolled] = useState(alwaysScrolled);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [active, setActive] = useState('');
  const ctaRef = useMagnetic({ strength: 0.25 });
  const megaTimer = useRef(null);

  // Scroll state
  useEffect(() => {
    if (alwaysScrolled) return;
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [alwaysScrolled]);

  // Active section observer
  useEffect(() => {
    if (alwaysScrolled) return; // detail page has no sections
    const targets = SECTIONS
      .map(id => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: '-20% 0px -50% 0px' }
    );
    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, [alwaysScrolled]);

  const links = [
    { id: 'cottages', href: '/#cottages', label: t('nav.cottages'), hasMega: true },
    { id: 'why',      href: '/#why',      label: t('nav.why') },
    { id: 'reviews',  href: '/#reviews',  label: t('nav.reviews') },
    { id: 'contact',  href: '/#contact',  label: t('nav.contact') },
  ];

  const openMega = () => {
    clearTimeout(megaTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMega(false), 180);
  };

  // Lock body scroll while mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Esc closes mobile + mega
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); setMega(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <motion.nav
        className={`nav ${scrolled ? 'scrolled' : ''} ${mega ? 'mega-active' : ''}`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Logo />

        <motion.div
          className="nav-links"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
        >
          {links.map((l) => (
            <motion.a
              key={l.id}
              href={l.href}
              className={`nav-link${active === l.id ? ' active' : ''}`}
              variants={{
                hidden: { opacity: 0, y: -10 },
                show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
              }}
              onMouseEnter={l.hasMega ? openMega : closeMega}
              onMouseLeave={l.hasMega ? closeMega : undefined}
            >
              <span>{l.label}</span>
              {l.hasMega && (
                <svg className="nav-link-chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
              {active === l.id && (
                <motion.span
                  className="nav-indicator"
                  layoutId="navIndicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          className="nav-actions"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <LanguageSwitcher />
          <a href="/#cottages" className="nav-cta" ref={ctaRef}>
            <span>{t('nav.book')}</span>
            <Icon name="arrowRight" size={14} stroke={2.4} />
          </a>
        </motion.div>

        <button
          className="nav-burger"
          aria-label={t('nav.menu')}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span className={open ? 'x1' : ''} />
          <span className={open ? 'x2' : ''} />
          <span className={open ? 'x3' : ''} />
        </button>

        {/* Mega-menu */}
        <div
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <MegaMenu open={mega} onClose={() => setMega(false)} />
        </div>
      </motion.nav>

      {/* MOBILE MENU — editorial full-screen */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu-v2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.img
              className="mobile-menu-bg"
              src={photoUrl(COTTAGES[0], COTTAGES[0].photos[0])}
              alt=""
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1,    opacity: 0.35 }}
              exit={{    scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            />
            <div className="mobile-menu-overlay" />

            <div className="mobile-menu-head">
              <Logo />
              <button
                className="mobile-menu-close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </div>

            <motion.nav
              className="mobile-menu-nav"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
            >
              {links.map((l, i) => (
                <motion.a
                  key={l.id}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
                  }}
                >
                  <span className="mobile-menu-num">{`0${i + 1}`}</span>
                  <span className="mobile-menu-label">{l.label}</span>
                  <Icon name="arrowRight" size={18} className="mobile-menu-arrow" />
                </motion.a>
              ))}
            </motion.nav>

            <motion.div
              className="mobile-menu-foot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <a href="/#cottages" className="btn btn-primary" onClick={() => setOpen(false)}>
                {t('nav.book')}
              </a>
              <div className="mobile-menu-meta">
                <LanguageSwitcher />
                <span className="mobile-menu-contact">Līči, Latvia · +371 00 000 000</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
