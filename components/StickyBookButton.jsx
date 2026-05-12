'use client';
import { useEffect, useState } from 'react';
import { useT } from '../lib/i18n.jsx';

export default function StickyBookButton() {
  const { t } = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById('booking');
    if (!target) return;

    const onScroll = () => {
      if (window.scrollY < 400) {
        setVisible(false);
        return;
      }
      const rect = target.getBoundingClientRect();
      const formInView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
      setVisible(!formInView);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const onClick = () => {
    const target = document.getElementById('booking');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      type="button"
      className={`sticky-book-btn${visible ? ' is-visible' : ''}`}
      onClick={onClick}
      aria-label={t('nav.book') || 'Book'}
    >
      {t('nav.book') || 'Book now'}
    </button>
  );
}
