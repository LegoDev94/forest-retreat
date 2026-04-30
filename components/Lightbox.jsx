'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { photoUrl } from '../lib/data';
import { useT } from '../lib/i18n.jsx';

export default function Lightbox({ cottage, index, onClose, onChange }) {
  const { pick } = useT();
  const open = index !== null;
  const name = pick(cottage.name);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  onChange((index - 1 + cottage.photos.length) % cottage.photos.length);
      if (e.key === 'ArrowRight') onChange((index + 1) % cottage.photos.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, index, cottage, onChange, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="lightbox open"
          role="dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <button className="lightbox-close" aria-label="Закрыть" onClick={onClose}>✕</button>
          <button className="lightbox-arrow prev" aria-label="Предыдущее"
                  onClick={() => onChange((index - 1 + cottage.photos.length) % cottage.photos.length)}>‹</button>
          <motion.img
            key={index}
            className="lightbox-img"
            src={photoUrl(cottage, cottage.photos[index])}
            alt={`${name} — ${index + 1}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          />
          <button className="lightbox-arrow next" aria-label="Следующее"
                  onClick={() => onChange((index + 1) % cottage.photos.length)}>›</button>
          <div className="lightbox-counter">{index + 1} / {cottage.photos.length}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}