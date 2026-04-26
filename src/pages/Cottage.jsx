import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findCottage, photoUrl } from '../data';
import { useT, DICT } from '../i18n.jsx';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import ReviewCard from '../components/ReviewCard';
import Lightbox from '../components/Lightbox';
import BookingForm from '../components/BookingForm';

const ICON = {
  wifi: '📶', parking: '🅿️', jacuzzi: '♨️', sauna: '🧖', cinema: '🎬',
  pet: '🐾', kitchen: '🍳', ac: '❄️', lake: '🏞️', fishing: '🎣',
  bbq: '🔥', bike: '🚴', transfer: '🚐', family: '👨‍👩‍👧',
  fire: '🪵', balcony: '🌅', animals: '🦙', darts: '🎯', sofa: '🛋️',
};

export default function Cottage() {
  const { id } = useParams();
  const c = findCottage(id);
  const { t, pick, locale } = useT();
  const [lbIdx, setLbIdx] = useState(null);

  useEffect(() => {
    if (c) document.title = `${pick(c.name)} — Forest Retreat`;
  }, [c, locale, pick]);

  if (!c) {
    return (
      <>
        <Nav alwaysScrolled />
        <div style={{ padding: '160px 20px', textAlign: 'center', minHeight: '60vh' }}>
          <h1 className="detail-title">{t('detail.notFound')}</h1>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>{t('detail.back')}</Link>
        </div>
        <Footer />
      </>
    );
  }

  const fullName = pick(c.name);
  const parts = fullName.split(' ');
  const lastWord = parts.slice(-1)[0];
  const firstWords = parts.slice(0, -1).join(' ');

  return (
    <>
      <Nav alwaysScrolled />

      {/* DETAIL HERO */}
      <section className="detail-hero">
        <nav className="breadcrumb">
          <Link to="/">{t('detail.home')}</Link> <span>›</span>{' '}
          <Link to="/#cottages">{t('detail.cottages')}</Link> <span>›</span>{' '}
          <strong>{fullName}</strong>
        </nav>

        <div className="detail-title-row">
          <div>
            <h1 className="detail-title">
              {firstWords} <span className="accent">{lastWord}</span>
            </h1>
            <div className="detail-meta-row">
              <span className="pill">★ {c.rating} · {c.reviewsCount} {t('detail.reviewsCount')}</span>
              <span className="pill">{t('detail.location')}</span>
              <span className="pill">🛏 {c.bedrooms} {t('detail.bedroom')} {t('detail.bedroomsTo')} {c.sleeps} {t('detail.guestsLabel')}</span>
              <span className="pill">📐 {c.area} {t('detail.sqm')}</span>
              <span className="pill">🏡 {pick(c.type)}</span>
            </div>
          </div>
          <div className="rating-big">
            <div className="rating-num">{c.rating}</div>
            <div className="rating-detail">
              <strong>{pick(c.ratingLabel)}</strong>
              {c.reviewsCount} {t('detail.reviewsCount')}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY MOSAIC */}
      <div className="gallery-mosaic">
        {c.photos.slice(0, 5).map((p, i) => (
          <div key={p} className="gallery-mosaic-item" onClick={() => setLbIdx(i)}>
            <img src={photoUrl(c, p)} alt={`${fullName} — ${i + 1}`} loading={i < 2 ? 'eager' : 'lazy'} />
            {i === 4 && <span className="show-all">📷 {t('detail.showAll')} · {c.photos.length}</span>}
          </div>
        ))}
      </div>

      {/* DETAIL BODY */}
      <div className="detail-body">
        <div>
          <Reveal as="section" className="detail-section">
            <h2>{t('detail.about')}</h2>
            <p>{pick(c.description)}</p>
          </Reveal>

          <Reveal as="section" className="detail-section">
            <h2>{t('detail.amenities')}</h2>
            <div className="amenities-grid">
              {c.amenities.map((a, i) => (
                <div key={i} className="amenity">
                  <div className="amenity-icon">{ICON[a.icon] || '✨'}</div>
                  <div className="amenity-label">{pick(DICT.amenities[a.key]) || a.key}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal as="section" className="detail-section">
            <h2>{t('detail.ratings')}</h2>
            <div className="categories-grid">
              {Object.entries(c.categories).map(([key, val]) => (
                <div key={key} className="category">
                  <div className="category-row">
                    <span>{pick(DICT.categories[key]) || key}</span>
                    <strong>{val.toFixed(1)}</strong>
                  </div>
                  <div className="category-bar">
                    <div className="category-bar-fill" style={{ width: `${val * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal as="section" className="detail-section" id="reviews">
            <h2>
              {t('detail.reviewsHead')}{' '}
              <span style={{ color: 'var(--text-3)', fontSize: '.7em', fontStyle: 'italic' }}>
                {t('detail.reviewsSub')}
              </span>
            </h2>
            <div className="reviews-grid">
              {c.reviews.map((r, i) => <ReviewCard key={i} review={r} />)}
            </div>
          </Reveal>
        </div>

        <aside>
          <BookingForm cottage={c} />
        </aside>
      </div>

      <Footer />

      <Lightbox
        cottage={c}
        index={lbIdx}
        onChange={setLbIdx}
        onClose={() => setLbIdx(null)}
      />
    </>
  );
}
