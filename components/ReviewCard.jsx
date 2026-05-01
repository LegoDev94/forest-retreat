'use client';
import { useT } from '../lib/i18n.jsx';

// Resolve a field that may be a plain string or an {ru,lv,en} tuple.
const resolve = (val, pick) =>
  val && typeof val === 'object' && ('ru' in val || 'lv' in val || 'en' in val)
    ? pick(val)
    : (val || '');

export default function ReviewCard({ review, showCottage = false }) {
  const { pick } = useT();
  const stars = Math.round(review.score / 2);
  const title   = resolve(review.title, pick);
  const text    = resolve(review.text, pick);
  const country = resolve(review.country, pick);
  const cottage = resolve(review.cottage, pick);
  return (
    <div className="review-card">
      <div className="review-stars">{'★'.repeat(stars)}</div>
      <div className="review-title">{title}</div>
      <p className="review-text">«{text}»</p>
      <div className="review-meta">
        <div className="review-avatar">{review.name.charAt(0)}</div>
        <div>
          <strong style={{ color: 'var(--text)' }}>{review.name}</strong> · {country}<br />
          <span style={{ color: 'var(--text-3)' }}>
            {showCottage && cottage ? `${cottage} · ` : ''}{review.date}
            {!showCottage && ` · ${review.score.toFixed(1)}/10`}
          </span>
        </div>
      </div>
    </div>
  );
}
