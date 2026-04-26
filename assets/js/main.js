// main.js — homepage interactions
(function () {
  'use strict';

  // --- Hero rotating background ---
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    // Pick a striking opener photo from each cottage
    const featured = [
      photoUrl(COTTAGES[0], COTTAGES[0].photos[0]), // Dragon
      photoUrl(COTTAGES[1], COTTAGES[1].photos[0]), // Viking
      photoUrl(COTTAGES[2], COTTAGES[2].photos[0]), // Farm
      photoUrl(COTTAGES[3], COTTAGES[3].photos[0]), // Black
    ];
    let idx = 0;
    function setBg(i) {
      heroBg.style.backgroundImage = `url("${featured[i]}")`;
    }
    setBg(0);
    setInterval(() => {
      idx = (idx + 1) % featured.length;
      heroBg.style.opacity = '0';
      setTimeout(() => { setBg(idx); heroBg.style.opacity = '1'; }, 600);
    }, 6500);
    heroBg.style.transition = 'opacity 0.7s ease';
  }

  // --- Stats ---
  const statRating = document.getElementById('statRating');
  const statReviews = document.getElementById('statReviews');
  if (statRating) statRating.textContent = STATS.avgRating;
  if (statReviews) statReviews.textContent = STATS.totalReviews + '+';

  // --- Pre-fill default dates (today+3 / today+5) ---
  const checkIn = document.getElementById('checkIn');
  const checkOut = document.getElementById('checkOut');
  if (checkIn && checkOut) {
    const t = new Date(); t.setDate(t.getDate() + 3);
    const t2 = new Date(); t2.setDate(t2.getDate() + 5);
    checkIn.value = t.toISOString().slice(0, 10);
    checkOut.value = t2.toISOString().slice(0, 10);
  }

  // --- Render cottage cards ---
  const grid = document.getElementById('cottagesGrid');
  if (grid) {
    grid.innerHTML = COTTAGES.map(c => `
      <a class="cottage-card reveal" href="cottage.html?id=${c.id}">
        <div class="cottage-card-media">
          <img src="${photoUrl(c, c.photos[0])}" alt="${c.name}" loading="lazy" />
          <span class="cottage-badge">${c.badge}</span>
          <span class="cottage-rating">${c.rating}</span>
          <div class="cottage-card-info">
            <div class="cottage-card-name">${c.name}</div>
            <div class="cottage-card-tagline">${c.tagline}</div>
            <div class="cottage-card-row">
              <div class="cottage-price"><strong>${c.pricePerNight}€</strong> / ночь</div>
              <span class="cottage-link">Открыть</span>
            </div>
          </div>
        </div>
      </a>
    `).join('');
  }

  // --- Render featured reviews ---
  const reviewsPreview = document.getElementById('reviewsPreview');
  if (reviewsPreview) {
    // Cherry-pick best review from each cottage
    const cherry = COTTAGES.map(c => {
      const r = c.reviews.find(r => r.score === 10) || c.reviews[0];
      return { ...r, cottage: c.name };
    });
    reviewsPreview.innerHTML = cherry.map(r => `
      <div class="review-card reveal">
        <div class="review-stars">★★★★★</div>
        <div class="review-title">${r.title}</div>
        <p class="review-text">«${r.text}»</p>
        <div class="review-meta">
          <div class="review-avatar">${r.name.charAt(0)}</div>
          <div>
            <strong style="color:var(--text)">${r.name}</strong> · ${r.country}<br />
            <span style="color:var(--text-3)">${r.cottage} · ${r.date}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- Nav scroll state ---
  const nav = document.getElementById('nav');
  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  // --- Mobile menu ---
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileMenu.classList.remove('open'))
    );
  }

  // --- Reveal on scroll ---
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
