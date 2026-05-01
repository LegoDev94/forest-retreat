'use client';
import { motion } from 'framer-motion';
import { useT, DICT } from '../lib/i18n.jsx';
import Reveal from './Reveal';

export default function ParkRules() {
  const { t, pick } = useT();
  return (
    <section className="section rules-section" id="park-rules">
      <Reveal className="section-head">
        <span className="section-eyebrow">{t('rules.eyebrow')}</span>
        <h2 className="section-title">
          {t('rules.titleA')} <span className="accent">{t('rules.titleAccent')}</span> {t('rules.titleB')}
        </h2>
      </Reveal>

      <motion.div
        className="rules-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
      >
        {DICT.rules.cards.map((card, i) => (
          <motion.div
            key={i}
            className="rules-card"
            variants={{
              hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
              show:   { opacity: 1, y: 0,  filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="rules-card-emoji" aria-hidden="true">{card.emoji}</div>
            <h3 className="rules-card-title">{pick(card.title)}</h3>
            <p className="rules-card-text">{pick(card.text)}</p>
          </motion.div>
        ))}
      </motion.div>

      <Reveal className="rules-disclaimer">
        <p>{t('rules.disclaimer')}</p>
      </Reveal>
    </section>
  );
}
