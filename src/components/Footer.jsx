import { Link } from 'react-router-dom';
import { useT } from '../i18n.jsx';
import { COTTAGES } from '../data';
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
              <li key={c.id}><Link to={`/cottage/${c.id}`}>{pick(c.name)}</Link></li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t('footer.info')}</h4>
          <ul>
            <li><a href="/#why">{t('nav.why')}</a></li>
            <li><a href="/#reviews">{t('nav.reviews')}</a></li>
            <li><a href="/#cottages">{t('footer.booking')}</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t('footer.contact')}</h4>
          <ul>
            <li>Līči, Latvia</li>
            <li>+371 00 000 000</li>
            <li>hello@forestretreat.lv</li>
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
