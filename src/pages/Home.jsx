import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { COTTAGES, STATS, photoUrl } from '../data';
import { useT, DICT } from '../i18n.jsx';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import CottageCard from '../components/CottageCard';
import Reveal from '../components/Reveal';
import Counter from '../components/Counter';
import ReviewCard from '../components/ReviewCard';
import DateField from '../components/DateField';

const offset = (days) => { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); };

function Hero() {
  const { t, locale, pick } = useT();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.15]);

  const [checkIn, setCheckIn]   = useState(offset(3));
  const [checkOut, setCheckOut] = useState(offset(5));

  const onCheckInChange = (v) => {
    setCheckIn(v);
    if (new Date(checkOut) <= new Date(v)) {
      const next = new Date(v); next.setDate(next.getDate() + 1);
      setCheckOut(next.toISOString().slice(0, 10));
    }
  };

  const featured = [
    photoUrl(COTTAGES[0], COTTAGES[0].photos[0]),
    photoUrl(COTTAGES[1], COTTAGES[1].photos[0]),
    photoUrl(COTTAGES[2], COTTAGES[2].photos[0]),
    photoUrl(COTTAGES[3], COTTAGES[3].photos[0]),
  ];
  const [bgIdx, setBgIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setBgIdx(i => (i + 1) % featured.length), 6500);
    return () => clearInterval(id);
  }, []);

  const guestOpts = DICT.guestsOptions[locale];

  return (
    <section className="hero" ref={heroRef}>
      <motion.div
        className="hero-bg kenburns"
        style={{ backgroundImage: `url("${featured[bgIdx]}")`, y: bgY, scale: bgScale }}
      />
      <div className="hero-overlay" />
      <motion.div className="hero-content" style={{ y: contentY, opacity: contentOpacity }}>
        <motion.span className="hero-eyebrow"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}>
          {t('hero.eyebrow')}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}>
          {t('hero.titleA')} <br />{t('hero.titleB')} <span className="accent">{t('hero.titleAccent')}</span>
        </motion.h1>
        <motion.p className="lead"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}>
          {t('hero.lead')}
        </motion.p>

        <motion.form
          className="search-bar"
          onSubmit={(e) => { e.preventDefault(); document.getElementById('cottages')?.scrollIntoView({ behavior: 'smooth' }); }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="search-field">
            <label>{t('hero.where')}</label>
            <input type="text" defaultValue={t('hero.place')} readOnly />
          </div>
          <DateField label={t('hero.checkIn')} value={checkIn} onChange={onCheckInChange} minDate={offset(0)} align="left" />
          <DateField label={t('hero.checkOut')} value={checkOut} onChange={setCheckOut} minDate={checkIn} align="left" />
          <div className="search-field">
            <label>{t('hero.guests')}</label>
            <select defaultValue={guestOpts[1]}>
              {guestOpts.map((g, i) => <option key={i}>{g}</option>)}
            </select>
          </div>
          <button className="search-btn" type="submit">
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {t('hero.search')}
          </button>
        </motion.form>

        <motion.div className="hero-stats"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.6, ease: [0.2, 0.8, 0.2, 1] }}>
          <div className="hero-stat">
            <span className="hero-stat-num"><Counter to={parseFloat(STATS.avgRating)} decimals={1} /></span>
            <span className="hero-stat-label">{t('hero.statRating')}</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num"><Counter to={STATS.totalReviews} suffix="+" /></span>
            <span className="hero-stat-label">{t('hero.statReviews')}</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num"><Counter to={STATS.totalCottages} /></span>
            <span className="hero-stat-label">{t('hero.statHomes')}</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">∞</span>
            <span className="hero-stat-label">{t('hero.statSilence')}</span>
          </div>
        </motion.div>
      </motion.div>
      <div className="scroll-hint">{t('hero.scroll')}</div>
    </section>
  );
}

function Story({ image, eyebrow, titleHTML, paragraphs, pills, reverse = false }) {
  return (
    <section className="section" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <Reveal className={`story ${reverse ? 'reverse' : ''}`}>
        <div className="story-visual">
          <img src={image} alt="" loading="lazy" />
        </div>
        <div className="story-text">
          <span className="eyebrow">{eyebrow}</span>
          <h3 dangerouslySetInnerHTML={{ __html: titleHTML }} />
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          <div className="pill-row">
            {pills.map((p, i) => <span key={i} className="pill-sm">{p}</span>)}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Home() {
  const { t, pick } = useT();

  const cherryReviews = COTTAGES.map(c => {
    const r = c.reviews.find(rv => rv.score === 10) || c.reviews[0];
    return { ...r, cottage: pick(c.name) };
  });

  return (
    <>
      <Nav />
      <Hero />

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-track">
          {[...DICT.marquee, ...DICT.marquee].map((m, i) => <span key={i} className="marquee-item">{pick(m)}</span>)}
        </div>
      </div>

      {/* COTTAGES */}
      <section className="section" id="cottages">
        <Reveal className="section-head">
          <span className="section-eyebrow">{t('cottages.eyebrow')}</span>
          <h2 className="section-title">{t('cottages.titleA')} <br /><span className="accent">{t('cottages.titleB')}</span> {t('cottages.titleC')}</h2>
          <p className="section-sub">{t('cottages.sub')}</p>
        </Reveal>
        <div className="cottages">
          {COTTAGES.map((c, i) => <CottageCard key={c.id} cottage={c} delay={i * 0.08} />)}
        </div>
      </section>

      {/* STORY 1 */}
      <Story
        image={photoUrl(COTTAGES[0], COTTAGES[0].photos[4])}
        eyebrow={t('story1.eyebrow')}
        titleHTML={t('story1.title')}
        paragraphs={[t('story1.p1'), t('story1.p2')]}
        pills={DICT.story1.pills.map(pick)}
      />

      {/* TRUST STRIP */}
      <section className="section" style={{ paddingTop: 30, paddingBottom: 30 }}>
        <motion.div className="trust-strip"
          initial="hidden" whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}>
          {DICT.trust.map((tt, i) => (
            <motion.div key={i} className="trust-item"
              variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}>
              <div className="trust-icon">{tt.icon}</div>
              <div className="trust-title">{pick(tt.title)}</div>
              <div className="trust-desc">{pick(tt.desc)}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* STORY 2 */}
      <Story
        reverse
        image={photoUrl(COTTAGES[1], COTTAGES[1].photos[6])}
        eyebrow={t('story2.eyebrow')}
        titleHTML={t('story2.title')}
        paragraphs={[t('story2.p1'), t('story2.p2')]}
        pills={DICT.story2.pills.map(pick)}
      />

      {/* STORY 3 */}
      <Story
        image={photoUrl(COTTAGES[2], COTTAGES[2].photos[0])}
        eyebrow={t('story3.eyebrow')}
        titleHTML={t('story3.title')}
        paragraphs={[t('story3.p1'), t('story3.p2')]}
        pills={DICT.story3.pills.map(pick)}
      />

      {/* WHY US */}
      <section className="section" id="why">
        <Reveal className="section-head">
          <span className="section-eyebrow">{t('why.eyebrow')}</span>
          <h2 className="section-title">{t('why.titleA')} <br /><span className="accent">{t('why.titleB')}</span> {t('why.titleC')}</h2>
        </Reveal>
        <div className="features-grid">
          {DICT.features.map((f, i) => (
            <Reveal key={i} className="feature" delay={i * 0.06}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{pick(f.title)}</h3>
              <p>{pick(f.text)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section" id="reviews">
        <Reveal className="section-head">
          <span className="section-eyebrow">{t('reviewsSection.eyebrow')}</span>
          <h2 className="section-title">{t('reviewsSection.titleA')} <br />{t('reviewsSection.titleB')} <span className="accent">{t('reviewsSection.titleAccent')}</span>.</h2>
          <p className="section-sub">{t('reviewsSection.sub').replace('{n}', STATS.totalReviews).replace('{r}', STATS.avgRating)}</p>
        </Reveal>
        <div className="reviews-preview">
          {cherryReviews.map((r, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <ReviewCard review={r} showCottage />
            </Reveal>
          ))}
        </div>
      </section>

      {/* MAP */}
      <section className="section" style={{ paddingTop: 80 }}>
        <Reveal className="section-head">
          <span className="section-eyebrow">{t('map.eyebrow')}</span>
          <h2 className="section-title">{t('map.titleA')} <span className="accent">{t('map.titleAccent')}</span>{t('map.titleB')}</h2>
          <p className="section-sub">{t('map.sub')}</p>
        </Reveal>
        <Reveal className="map-wrap">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=22.45%2C57.18%2C22.65%2C57.30&layer=mapnik&marker=57.235%2C22.55"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Forest Retreat — map"
          />
          <div className="map-pin">
            <span className="map-pin-label">{t('map.pin')}</span>
            <span className="map-pin-dot" />
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="section" id="contact">
        <Reveal className="cta-banner">
          <h2>{t('cta.titleA')} <br />{t('cta.titleB')} <span style={{ fontStyle: 'italic', color: 'var(--accent-2)' }}>{t('cta.titleAccent')}</span>?</h2>
          <p>{t('cta.sub')}</p>
          <a href="#cottages" className="btn btn-primary">{t('cta.btn')}</a>
        </Reveal>
      </section>

      <a href="#cottages" className="fab">
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="18" height="18">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        {t('fab')}
      </a>

      <Footer />
    </>
  );
}
