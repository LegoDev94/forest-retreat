'use client';
import { LocaleLink as Link } from '../lib/i18n.jsx';
import { useT } from '../lib/i18n.jsx';
import { COTTAGES } from '../lib/data';
import { COMPANY } from '../lib/legal';
import Logo from './Logo';

export default function Footer() {
  const { t, pick } = useT();
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>{t('footer.tagline')}</p>
        </div>
        <div className="footer-col">
          <h4>{t('footer.cottages')}</h4>
          <ul>
            {COTTAGES.map(c => (
              <li key={c.id}><Link href={`/cottage/${c.id}`}>{pick(c.name)}</Link></li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t('footer.info')}</h4>
          <ul>
            <li><Link href="/services">{t('nav.services')}</Link></li>
            <li><a href="/#why">{t('nav.why')}</a></li>
            <li><a href="/#reviews">{t('nav.reviews')}</a></li>
            <li><a href="/#cottages">{t('footer.booking')}</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t('footer.contact')}</h4>
          <ul>
            <li><strong>{COMPANY.name}</strong></li>
            <li>Reģ. Nr. {COMPANY.regNo}</li>
            <li>{COMPANY.address}</li>
            <li><a href={`tel:${COMPANY.phone.replace(/\s+/g, '')}`}>{COMPANY.phone}</a></li>
            <li><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
            <li className="footer-card-note">{t('services.cardOnSite')}</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t('footer.legal')}</h4>
          <ul>
            <li><Link href="/legal/terms">{t('footer.terms')}</Link></li>
            <li><Link href="/legal/privacy">{t('footer.privacy')}</Link></li>
            <li><Link href="/legal/refund">{t('footer.refund')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>{t('footer.rights')}</span>
        <span>{t('footer.madeWith')}</span>
      </div>
    </footer>
  );
}