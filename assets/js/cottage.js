// cottage.js — detail page interactions
(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  const id = params.get('id') || 'dragon';
  const c = findCottage(id);

  if (!c) {
    document.body.innerHTML = '<div style="padding:120px 20px;text-align:center"><h1 class="detail-title">Дом не найден</h1><a href="index.html" class="btn btn-primary" style="margin-top:24px">Вернуться</a></div>';
    return;
  }

  document.title = `${c.name} — Forest Retreat`;

  // --- Title row ---
  const titleParts = c.name.split(' ');
  const lastWord = titleParts.pop();
  document.getElementById('title').innerHTML =
    `${titleParts.join(' ')} <span class="accent">${lastWord}</span>`;
  document.getElementById('bcCurrent').textContent = c.name;

  document.getElementById('metaRow').innerHTML = `
    <span class="pill">★ ${c.rating} · ${c.reviewsCount} отзывов</span>
    <span class="pill">📍 Līči, Латвия</span>
    <span class="pill">🛏 ${c.bedrooms} спальня · до ${c.sleeps} гостей</span>
    <span class="pill">📐 ${c.area} м²</span>
    <span class="pill">🏡 ${c.type}</span>
  `;

  document.getElementById('ratingBig').innerHTML = `
    <div class="rating-num">${c.rating}</div>
    <div class="rating-detail"><strong>${c.ratingLabel}</strong>${c.reviewsCount} отзывов</div>
  `;

  // --- Gallery mosaic (5 photos: 1 large + 4 small) ---
  const mosaic = document.getElementById('galleryMosaic');
  const mosaicPhotos = c.photos.slice(0, 5);
  mosaic.innerHTML = mosaicPhotos.map((p, i) => `
    <div class="gallery-mosaic-item" data-idx="${i}">
      <img src="${photoUrl(c, p)}" alt="${c.name} — фото ${i + 1}" loading="${i < 2 ? 'eager' : 'lazy'}" />
      ${i === 4 ? `<span class="show-all">📷 Все фото · ${c.photos.length}</span>` : ''}
    </div>
  `).join('');

  // --- Description ---
  document.getElementById('description').textContent = c.description;

  // --- Amenities ---
  const iconMap = {
    wifi: '📶', parking: '🅿️', jacuzzi: '♨️', sauna: '🧖', cinema: '🎬',
    pet: '🐾', kitchen: '🍳', ac: '❄️', lake: '🏞️', fishing: '🎣',
    bbq: '🔥', bike: '🚴', transfer: '🚐', family: '👨‍👩‍👧',
    fire: '🪵', balcony: '🌅', animals: '🦙', darts: '🎯', sofa: '🛋️'
  };
  document.getElementById('amenitiesGrid').innerHTML = c.amenities.map(a => `
    <div class="amenity">
      <div class="amenity-icon">${iconMap[a.icon] || '✨'}</div>
      <div class="amenity-label">${a.label}</div>
    </div>
  `).join('');

  // --- Categories ---
  document.getElementById('categoriesGrid').innerHTML =
    Object.entries(c.categories).map(([name, val]) => `
      <div class="category">
        <div class="category-row"><span>${name}</span><strong>${val.toFixed(1)}</strong></div>
        <div class="category-bar"><div class="category-bar-fill" style="width:${val * 10}%"></div></div>
      </div>
    `).join('');

  // --- Reviews ---
  document.getElementById('reviewsGrid').innerHTML = c.reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(Math.round(r.score / 2))}</div>
      <div class="review-title">${r.title}</div>
      <p class="review-text">«${r.text}»</p>
      <div class="review-meta">
        <div class="review-avatar">${r.name.charAt(0)}</div>
        <div>
          <strong style="color:var(--text)">${r.name}</strong> · ${r.country}<br />
          <span style="color:var(--text-3)">${r.date} · ${r.score.toFixed(1)}/10</span>
        </div>
      </div>
    </div>
  `).join('');

  // --- Booking sidebar ---
  document.getElementById('priceNum').textContent = c.pricePerNight;

  const bIn = document.getElementById('bCheckIn');
  const bOut = document.getElementById('bCheckOut');
  const today = new Date(); today.setDate(today.getDate() + 3);
  const later = new Date(); later.setDate(later.getDate() + 5);
  bIn.value = today.toISOString().slice(0, 10);
  bOut.value = later.toISOString().slice(0, 10);
  bIn.min = new Date().toISOString().slice(0, 10);

  function updateSummary() {
    const d1 = new Date(bIn.value);
    const d2 = new Date(bOut.value);
    let nights = Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
    if (!Number.isFinite(nights)) nights = 0;
    const base = c.pricePerNight * nights;
    const fee = Math.round(base * 0.06);
    const total = base + 30 + fee;
    document.getElementById('sNights').textContent = `${c.pricePerNight} € × ${nights} ${pluralNight(nights)}`;
    document.getElementById('sBase').textContent = `${base} €`;
    document.getElementById('sFee').textContent = `${fee} €`;
    document.getElementById('sTotal').textContent = `${nights > 0 ? total : 0} €`;
  }
  function pluralNight(n) {
    const m = Math.abs(n) % 100; const m2 = m % 10;
    if (m > 10 && m < 20) return 'ночей';
    if (m2 > 1 && m2 < 5) return 'ночи';
    if (m2 === 1) return 'ночь';
    return 'ночей';
  }
  bIn.addEventListener('change', () => {
    if (new Date(bOut.value) <= new Date(bIn.value)) {
      const next = new Date(bIn.value); next.setDate(next.getDate() + 1);
      bOut.value = next.toISOString().slice(0, 10);
    }
    bOut.min = bIn.value;
    updateSummary();
  });
  bOut.addEventListener('change', updateSummary);
  updateSummary();

  // --- Form submit ---
  const successModal = document.getElementById('successModal');
  document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    successModal.classList.add('open');
  });
  document.getElementById('modalClose').addEventListener('click', () => successModal.classList.remove('open'));
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) successModal.classList.remove('open');
  });

  // --- Lightbox ---
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCounter = document.getElementById('lbCounter');
  let lbIdx = 0;
  function showLb(i) {
    lbIdx = (i + c.photos.length) % c.photos.length;
    lbImg.src = photoUrl(c, c.photos[lbIdx]);
    lbCounter.textContent = `${lbIdx + 1} / ${c.photos.length}`;
  }
  function openLb(i) {
    showLb(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  mosaic.querySelectorAll('.gallery-mosaic-item').forEach((item) => {
    item.addEventListener('click', () => openLb(parseInt(item.dataset.idx, 10) || 0));
  });
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', () => showLb(lbIdx - 1));
  document.getElementById('lbNext').addEventListener('click', () => showLb(lbIdx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showLb(lbIdx - 1);
    if (e.key === 'ArrowRight') showLb(lbIdx + 1);
  });

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
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
