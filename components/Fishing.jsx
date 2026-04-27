'use client';
import { useT, DICT } from '../lib/i18n.jsx';
import Reveal from './Reveal';

export default function Fishing() {
  const { t, pick } = useT();
  return (
    <section className="section fishing-section" id="fishing">
      <Reveal className="story reverse">
        <div className="story-visual fishing-visual">
          <img src="/content/fishing/photo/16902381.jpg" alt="" loading="lazy" />
          <img src="/content/fishing/photo/31729463.jpg" alt="" loading="lazy" className="fishing-visual-overlay" />
        </div>
        <div className="story-text">
          <span className="eyebrow">{t('fishing.eyebrow')}</span>
          <h3>
            {t('fishing.titleA')} <em>{t('fishing.titleAccent')}</em>
            {t('fishing.titleB')}
          </h3>
          <p>{t('fishing.p1')}</p>
          <p>{t('fishing.p2')}</p>
          <div className="pill-row">
            {DICT.fishing.pills.map((p, i) => <span key={i} className="pill-sm">{pick(p)}</span>)}
          </div>
        </div>
      </Reveal>
    </section>
  );
}