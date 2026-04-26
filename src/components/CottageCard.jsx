import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { photoUrl } from '../data';
import { useRef } from 'react';
import { useT } from '../i18n.jsx';

const spring = { stiffness: 220, damping: 25, mass: 0.6 };

export default function CottageCard({ cottage, delay = 0 }) {
  const { t, pick } = useT();
  const ref = useRef(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rx = useSpring(useTransform(mvY, v => v * -8), spring);
  const ry = useSpring(useTransform(mvX, v => v *  8), spring);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mvX.set((e.clientX - r.left) / r.width  - 0.5);
    mvY.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const onLeave = () => { mvX.set(0); mvY.set(0); };

  const name = pick(cottage.name);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', perspective: 1200 }}
      initial={{ opacity: 0, y: 60, scale: 0.97, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay }}
    >
      <Link to={`/cottage/${cottage.id}`} className="cottage-card">
        <div className="cottage-card-media">
          <img src={photoUrl(cottage, cottage.photos[0])} alt={name} loading="lazy" />
          <span className="cottage-badge">{pick(cottage.badge)}</span>
          <span className="cottage-rating">{cottage.rating}</span>
          <div className="cottage-card-info">
            <div className="cottage-card-name">{name}</div>
            <div className="cottage-card-tagline">{pick(cottage.tagline)}</div>
            <div className="cottage-card-row">
              <div className="cottage-price"><strong>{cottage.pricePerNight}€</strong> {t('cottages.perNight')}</div>
              <span className="cottage-link">{t('cottages.open')}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
