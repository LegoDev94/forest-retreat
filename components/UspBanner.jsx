'use client';
import { motion } from 'framer-motion';
import { useT } from '../lib/i18n.jsx';
import Icon from './Icon';

export default function UspBanner() {
  const { t } = useT();
  return (
    <section className="section usp-section">
      <motion.div
        className="usp-banner"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="usp-orbit" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>

        <div className="usp-badge">
          <Icon name="award" size={16} stroke={2} />
          <span>{t('usp.badge')}</span>
        </div>

        <h2 className="usp-title" dangerouslySetInnerHTML={{ __html: t('usp.title') }} />
        <p className="usp-sub">{t('usp.sub')}</p>
      </motion.div>
    </section>
  );
}