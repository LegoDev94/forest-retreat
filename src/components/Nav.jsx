import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Nav({ alwaysScrolled = false }) {
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
          <a href="/#cottages">Дома</a>
          <a href="/#why">Почему мы</a>
          <a href="/#reviews">Отзывы</a>
          <a href="/#contact">Контакты</a>
        </div>
        <a href="/#cottages" className="nav-cta">Забронировать</a>
        <button className="nav-burger" aria-label="Меню" onClick={() => setOpen(o => !o)}>
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
            <a href="/#cottages">Дома</a>
            <a href="/#why">Почему мы</a>
            <a href="/#reviews">Отзывы</a>
            <a href="/#contact">Контакты</a>
            <a href="/#cottages" className="btn btn-primary">Забронировать</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
