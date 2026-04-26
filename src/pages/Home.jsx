import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { COTTAGES, STATS, photoUrl } from '../data';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import CottageCard from '../components/CottageCard';
import Reveal from '../components/Reveal';
import Counter from '../components/Counter';
import ReviewCard from '../components/ReviewCard';

const offset = (days) => { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); };

const FEATURES = [
  { icon: '🌲', title: 'Полное уединение',   text: 'Каждый дом стоит отдельно в окружении леса и озера. Никаких соседей за стенкой — только звук ветра и пение птиц.' },
  { icon: '♨️', title: 'Джакузи и сауна',     text: 'Парная по-чёрному, гидромассажная купель под открытым небом — расслабьтесь после прогулки по лесу.' },
  { icon: '🦙', title: 'Мини-зоопарк',        text: 'Альпаки, пони, овечки, козы и кролики, которые едят с рук. Дети будут счастливы. Взрослые — тоже.' },
  { icon: '🎬', title: 'Кино в лесу',         text: 'Кинопроектор с Netflix в тишине леса. Фильм, плед, бокал вина — лучшая премьера в вашей жизни.' },
  { icon: '🐾', title: 'С питомцами — бесплатно', text: 'Берите с собой собак — они будут в восторге от свободы. Никаких доплат, только радостные хвосты.' },
  { icon: '🎣', title: 'Рыбалка и лодки',     text: 'Карп, линь, щука, карась — в озере прямо у домика. Лодки — бесплатно. Удочки можно прихватить с собой.' },
];

const TRUST = [
  { icon: '✓',  title: 'Без предоплаты',     desc: 'Платите при заезде' },
  { icon: '⏱',  title: 'Бесплатная отмена',  desc: 'До 48 часов до заезда' },
  { icon: '🔒', title: 'Безопасная оплата',  desc: 'Защищённые транзакции' },
  { icon: '⭐', title: '9.0 / 10',           desc: '464 проверенных отзыва' },
  { icon: '📞', title: 'Хост 24/7',          desc: 'На связи всегда' },
];

const MARQUEE = [
  'Джакузи под звёздами','Сауна на закате','Альпаки и пони','Озеро у порога',
  'Кино под открытым небом','Камин и тишина',
];

function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.15]);

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

  return (
    <section className="hero" ref={heroRef}>
      <motion.div
        className="hero-bg kenburns"
        style={{
          backgroundImage: `url("${featured[bgIdx]}")`,
          y: bgY,
          scale: bgScale,
        }}
      />
      <div className="hero-overlay" />
      <motion.div className="hero-content" style={{ y: contentY, opacity: contentOpacity }}>
        <motion.span
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Латвия · Līči · 4 уникальных дома
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Где лес <br />встречает <span className="accent">тишину</span>
        </motion.h1>
        <motion.p
          className="lead"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Уединённые домики у озера, джакузи под звёздами, сауна на закате и животные, которые приходят прямо к порогу. Сбегите в сказку всего за 2 часа от Риги.
        </motion.p>

        <motion.form
          className="search-bar"
          onSubmit={(e) => { e.preventDefault(); document.getElementById('cottages')?.scrollIntoView({ behavior: 'smooth' }); }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="search-field">
            <label>Куда</label>
            <input type="text" defaultValue="Латвия, Līči" readOnly />
          </div>
          <div className="search-field">
            <label>Заезд</label>
            <input type="date" defaultValue={offset(3)} />
          </div>
          <div className="search-field">
            <label>Выезд</label>
            <input type="date" defaultValue={offset(5)} />
          </div>
          <div className="search-field">
            <label>Гостей</label>
            <select defaultValue="2 гостя">
              <option>2 гостя</option><option>3 гостя</option><option>4 гостя</option>
            </select>
          </div>
          <button className="search-btn" type="submit">
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Искать
          </button>
        </motion.form>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="hero-stat">
            <span className="hero-stat-num"><Counter to={parseFloat(STATS.avgRating)} decimals={1} /></span>
            <span className="hero-stat-label">Средняя оценка</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num"><Counter to={STATS.totalReviews} suffix="+" /></span>
            <span className="hero-stat-label">Отзывов гостей</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num"><Counter to={STATS.totalCottages} /></span>
            <span className="hero-stat-label">Уникальных дома</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">∞</span>
            <span className="hero-stat-label">Тишины и леса</span>
          </div>
        </motion.div>
      </motion.div>
      <div className="scroll-hint">Прокрути</div>
    </section>
  );
}

function Story({ image, eyebrow, title, paragraphs, pills, reverse = false }) {
  return (
    <section className="section" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <Reveal className={`story ${reverse ? 'reverse' : ''}`}>
        <div className="story-visual">
          <img src={image} alt="" loading="lazy" />
        </div>
        <div className="story-text">
          <span className="eyebrow">{eyebrow}</span>
          <h3 dangerouslySetInnerHTML={{ __html: title }} />
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
  const cherryReviews = COTTAGES.map(c => {
    const r = c.reviews.find(rv => rv.score === 10) || c.reviews[0];
    return { ...r, cottage: c.name };
  });

  return (
    <>
      <Nav />
      <Hero />

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => <span key={i} className="marquee-item">{m}</span>)}
        </div>
      </div>

      {/* COTTAGES */}
      <section className="section" id="cottages">
        <Reveal className="section-head">
          <span className="section-eyebrow">— Наши дома</span>
          <h2 className="section-title">Четыре характера. <br /><span className="accent">Одна магия</span> леса.</h2>
          <p className="section-sub">Каждый домик — это история. Выберите свою: дом-дракон с кинотеатром, аутентичная вилла викингов, ферма с альпаками или загадочное чёрное шале.</p>
        </Reveal>
        <div className="cottages">
          {COTTAGES.map((c, i) => <CottageCard key={c.id} cottage={c} delay={i * 0.08} />)}
        </div>
      </section>

      {/* STORY 1 */}
      <Story
        image={photoUrl(COTTAGES[0], COTTAGES[0].photos[4])}
        eyebrow="— История места"
        title='Где время <em>замедляется</em>, а душа <em>выдыхает</em>.'
        paragraphs={[
          'Лес. Озеро. Тёплый свет от костра. Каждый домик — это миниатюрная вселенная, где интерьер собран по крупицам, мебель — с историей, а вид из окна меняется с временем суток.',
          'Никаких типовых отелей с пластиковыми ключами и лифтами. Только дерево, ткань, тёплый свет и ритм природы.',
        ]}
        pills={['🌲 1.5 ч от Риги', '🛏 До 4 гостей', '🐾 С питомцами бесплатно']}
      />

      {/* TRUST STRIP */}
      <section className="section" style={{ paddingTop: 30, paddingBottom: 30 }}>
        <motion.div
          className="trust-strip"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        >
          {TRUST.map((t, i) => (
            <motion.div
              key={i}
              className="trust-item"
              variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="trust-icon">{t.icon}</div>
              <div className="trust-title">{t.title}</div>
              <div className="trust-desc">{t.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* STORY 2 */}
      <Story
        reverse
        image={photoUrl(COTTAGES[1], COTTAGES[1].photos[6])}
        eyebrow="— Spa & Wellness"
        title='Джакузи под звёздами. <em>Сауна</em> на закате.'
        paragraphs={[
          'Гидромассажная купель прямо под открытым небом — 39° тёплой воды, тишина леса и небо в звёздах. Финская сауна с ароматом дерева. Перепрыгивание из жара в холодное озеро — и снова в тепло.',
          'Лучший способ сбросить городской стресс — встретить ночь в купели с бокалом вина под пение совы.',
        ]}
        pills={['♨️ Гидромассажная ванна', '🧖 Финская сауна', '🔥 Камин и BBQ']}
      />

      {/* STORY 3 */}
      <Story
        image={photoUrl(COTTAGES[2], COTTAGES[2].photos[0])}
        eyebrow="— Для души и детей"
        title='Альпаки, пони, кролики — <em>прямо у порога</em>.'
        paragraphs={[
          'Кролики выходят к крыльцу за морковкой. Альпаки и пони пасутся за оградой. Собаки хозяев — самые добрые в Латвии. Возьмите с собой яблок и моркови — это лучшие друзья на отпуск.',
          'Дети будут заняты весь день: животные, лодки, рыбалка, велосипеды, детская площадка. Взрослые — тоже.',
        ]}
        pills={['🦙 Альпаки', '🐰 Свободные кролики', '🎣 Озеро с рыбой', '🚴 Велосипеды']}
      />

      {/* WHY US */}
      <section className="section" id="why">
        <Reveal className="section-head">
          <span className="section-eyebrow">— Почему Forest Retreat</span>
          <h2 className="section-title">Не отель. <br /><span className="accent">Личный мир</span> в лесу.</h2>
        </Reveal>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={i} className="feature" delay={i * 0.06}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section" id="reviews">
        <Reveal className="section-head">
          <span className="section-eyebrow">— Отзывы гостей</span>
          <h2 className="section-title">Что говорят те, <br />кто <span className="accent">уже вернулся</span>.</h2>
          <p className="section-sub">{STATS.totalReviews}+ отзывов на Booking.com со средней оценкой {STATS.avgRating}/10. Вот лучшие из них.</p>
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
          <span className="section-eyebrow">— Где мы</span>
          <h2 className="section-title">В сердце <span className="accent">Курземе</span>. <br />1.5 часа от Риги.</h2>
          <p className="section-sub">Līči, Латвия — посёлок среди лесов и озёр. Свой пруд у каждого домика, до ближайшего магазина 20 км — то самое уединение, за которым едут.</p>
        </Reveal>
        <Reveal className="map-wrap">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=22.45%2C57.18%2C22.65%2C57.30&layer=mapnik&marker=57.235%2C22.55"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Forest Retreat — карта"
          />
          <div className="map-pin">
            <span className="map-pin-label">Forest Retreat · Līči</span>
            <span className="map-pin-dot" />
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="section" id="contact">
        <Reveal className="cta-banner">
          <h2>Готовы сбежать <br />в <span style={{ fontStyle: 'italic', color: 'var(--accent-2)' }}>тишину</span>?</h2>
          <p>Забронируйте свой уголок леса прямо сейчас. Лучшие даты разбирают за месяц вперёд.</p>
          <a href="#cottages" className="btn btn-primary">Выбрать дом</a>
        </Reveal>
      </section>

      <a href="#cottages" className="fab">
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="18" height="18">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        Забронировать
      </a>

      <Footer />
    </>
  );
}
