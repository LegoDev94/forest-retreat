import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findCottage, photoUrl } from '../data';
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
  const [lbIdx, setLbIdx] = useState(null);

  if (!c) {
    return (
      <>
        <Nav alwaysScrolled />
        <div style={{ padding: '160px 20px', textAlign: 'center', minHeight: '60vh' }}>
          <h1 className="detail-title">Дом не найден</h1>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>Вернуться</Link>
        </div>
        <Footer />
      </>
    );
  }

  if (typeof document !== 'undefined') document.title = `${c.name} — Forest Retreat`;

  const [titleHead, ...titleTail] = c.name.split(' ');
  const lastWord = c.name.split(' ').slice(-1)[0];
  const firstWords = c.name.split(' ').slice(0, -1).join(' ');

  return (
    <>
      <Nav alwaysScrolled />

      {/* DETAIL HERO */}
      <section className="detail-hero">
        <nav className="breadcrumb">
          <Link to="/">Главная</Link> <span>›</span> <Link to="/#cottages">Дома</Link> <span>›</span> <strong>{c.name}</strong>
        </nav>

        <div className="detail-title-row">
          <div>
            <h1 className="detail-title">
              {firstWords} <span className="accent">{lastWord}</span>
            </h1>
            <div className="detail-meta-row">
              <span className="pill">★ {c.rating} · {c.reviewsCount} отзывов</span>
              <span className="pill">📍 Līči, Латвия</span>
              <span className="pill">🛏 {c.bedrooms} спальня · до {c.sleeps} гостей</span>
              <span className="pill">📐 {c.area} м²</span>
              <span className="pill">🏡 {c.type}</span>
            </div>
          </div>
          <div className="rating-big">
            <div className="rating-num">{c.rating}</div>
            <div className="rating-detail">
              <strong>{c.ratingLabel}</strong>
              {c.reviewsCount} отзывов
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY MOSAIC */}
      <div className="gallery-mosaic">
        {c.photos.slice(0, 5).map((p, i) => (
          <div key={p} className="gallery-mosaic-item" onClick={() => setLbIdx(i)}>
            <img src={photoUrl(c, p)} alt={`${c.name} — фото ${i + 1}`} loading={i < 2 ? 'eager' : 'lazy'} />
            {i === 4 && <span className="show-all">📷 Все фото · {c.photos.length}</span>}
          </div>
        ))}
      </div>

      {/* DETAIL BODY */}
      <div className="detail-body">
        <div>
          <Reveal as="section" className="detail-section">
            <h2>Об этом доме</h2>
            <p>{c.description}</p>
          </Reveal>

          <Reveal as="section" className="detail-section">
            <h2>Удобства и услуги</h2>
            <div className="amenities-grid">
              {c.amenities.map((a, i) => (
                <div key={i} className="amenity">
                  <div className="amenity-icon">{ICON[a.icon] || '✨'}</div>
                  <div className="amenity-label">{a.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal as="section" className="detail-section">
            <h2>Оценки гостей</h2>
            <div className="categories-grid">
              {Object.entries(c.categories).map(([name, val]) => (
                <div key={name} className="category">
                  <div className="category-row"><span>{name}</span><strong>{val.toFixed(1)}</strong></div>
                  <div className="category-bar">
                    <div className="category-bar-fill" style={{ width: `${val * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal as="section" className="detail-section" id="reviews">
            <h2>
              Отзывы{' '}
              <span style={{ color: 'var(--text-3)', fontSize: '.7em', fontStyle: 'italic' }}>
                — реальные истории гостей
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
