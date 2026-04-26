import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT, DICT } from '../i18n.jsx';
import Reveal from './Reveal';

function FaqItem({ q, a, isOpen, onToggle, index }) {
  return (
    <Reveal className={`faq-item${isOpen ? ' open' : ''}`} delay={index * 0.05}>
      <button
        type="button"
        className="faq-q"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{q}</span>
        <span className="faq-chevron" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="faq-a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  );
}

export default function Faq() {
  const { t, pick } = useT();
  const [open, setOpen] = useState(0);

  return (
    <section className="section" id="faq">
      <Reveal className="section-head">
        <span className="section-eyebrow">{t('faq.eyebrow')}</span>
        <h2 className="section-title">
          {t('faq.titleA')} <span className="accent">{t('faq.titleAccent')}</span>{t('faq.titleB')}
        </h2>
      </Reveal>
      <div className="faq-list">
        {DICT.faq.items.map((item, i) => (
          <FaqItem
            key={i}
            index={i}
            q={pick(item.q)}
            a={pick(item.a)}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
}
