export default function ReviewCard({ review, showCottage = false }) {
  const stars = Math.round(review.score / 2);
  return (
    <div className="review-card">
      <div className="review-stars">{'★'.repeat(stars)}</div>
      <div className="review-title">{review.title}</div>
      <p className="review-text">«{review.text}»</p>
      <div className="review-meta">
        <div className="review-avatar">{review.name.charAt(0)}</div>
        <div>
          <strong style={{ color: 'var(--text)' }}>{review.name}</strong> · {review.country}<br />
          <span style={{ color: 'var(--text-3)' }}>
            {showCottage && review.cottage ? `${review.cottage} · ` : ''}{review.date}
            {!showCottage && ` · ${review.score.toFixed(1)}/10`}
          </span>
        </div>
      </div>
    </div>
  );
}
