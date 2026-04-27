import { motion } from 'framer-motion';
import { useT, DICT } from '../i18n.jsx';
import Reveal from './Reveal';
import Icon from './Icon';

const STEP_ICONS = ['compass', 'carrot', 'steps'];

export default function HowItWorks() {
  const { t, pick } = useT();
  return (
    <section className="section how-section" id="how-it-works">
      <Reveal className="section-head">
        <span className="section-eyebrow">{t('how.eyebrow')}</span>
        <h2 className="section-title">
          {t('how.titleA')} <span className="accent">{t('how.titleAccent')}</span>{t('how.titleB')}
        </h2>
      </Reveal>

      <motion.div
        className="how-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
      >
        {DICT.how.steps.map((step, i) => (
          <motion.div
            key={i}
            className="how-step"
            variants={{
              hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
              show:   { opacity: 1, y: 0,  filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="how-step-num">{step.num}</div>
            <div className="how-step-icon">
              <Icon name={STEP_ICONS[i]} size={28} stroke={1.6} />
            </div>
            <h3 className="how-step-title">{pick(step.title)}</h3>
            <p className="how-step-text">{pick(step.text)}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
