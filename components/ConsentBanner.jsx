'use client';
import { useEffect, useState } from 'react';
import { useT } from '../lib/i18n.jsx';

const STORAGE_KEY = 'fr_consent_v1';

function applyConsent(granted) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  const state = granted ? 'granted' : 'denied';
  window.gtag('consent', 'update', {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
}

export default function ConsentBanner() {
  const { t, locale } = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'granted' || saved === 'denied') {
        applyConsent(saved === 'granted');
        return;
      }
    } catch {}
    setVisible(true);
  }, []);

  const choose = (granted) => {
    try { localStorage.setItem(STORAGE_KEY, granted ? 'granted' : 'denied'); } catch {}
    applyConsent(granted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="consent-banner" role="dialog" aria-live="polite" aria-label={t('consent.aria') || 'Cookie preferences'}>
      <div className="consent-banner-inner">
        <p className="consent-banner-text">
          {t('consent.text')}
          {' '}
          <a href={`/${locale}/legal/privacy`} className="consent-banner-link">{t('consent.privacy')}</a>
        </p>
        <div className="consent-banner-actions">
          <button type="button" className="consent-btn consent-btn-secondary" onClick={() => choose(false)}>
            {t('consent.reject')}
          </button>
          <button type="button" className="consent-btn consent-btn-primary" onClick={() => choose(true)}>
            {t('consent.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
