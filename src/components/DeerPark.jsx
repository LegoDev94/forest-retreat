import { motion } from 'framer-motion';
import { useT, DICT } from '../i18n.jsx';
import Reveal from './Reveal';
import Icon from './Icon';

const DEER_PHOTOS = [
  '29157100.jpg',
  '4074167.jpg',
  '14138716.jpg',
  '8891565.jpg',
  '18400259.jpg',
  '10479041.jpg',
];

export default function DeerPark() {
  const { t, pick } = useT();
  return (
    <section className="section deer-section" id="deer-park">
      <div className="deer-grid">
        {/* TEXT SIDE */}
        <Reveal className="deer-text">
          <span className="section-eyebrow">{t('deer.eyebrow')}</span>
          <h2 className="section-title">
            {t('deer.titleA')} <em>{t('deer.titleAccent')}</em>{' '}{t('deer.titleB')}
          </h2>
          <p>{t('deer.p1')}</p>
          <p>{t('deer.p2')}</p>
          <div className="pill-row">
            {DICT.deer.pills.map((p, i) => <span key={i} className="pill-sm">{pick(p)}</span>)}
          </div>
          <a href="#how-it-works" className="deer-link">
            {t('deer.cta')} <Icon name="arrowRight" size={14} stroke={2.4} />
          </a>
        </Reveal>

        {/* PHOTO COLLAGE */}
        <div className="deer-collage">
          {DEER_PHOTOS.map((p, i) => (
            <motion.div
              key={p}
              className={`deer-photo deer-photo-${i + 1}`}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.9,
                delay: i * 0.12,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              <img
                src={`/content/deer-park/photo/${p}`}
                alt=""
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
