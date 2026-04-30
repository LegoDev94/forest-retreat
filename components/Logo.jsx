import { LocaleLink as Link } from '../lib/i18n.jsx';

// Refined brand mark: small forest mark (stylized pines) in a gold halo,
// paired with a serif wordmark. Replaces the generic golden ring.
export default function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Forest Retreat — home">
      <span className="logo-mark">
        <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">
          <defs>
            <radialGradient id="logo-glow" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#e0c585" />
              <stop offset="60%" stopColor="#c9a86a" />
              <stop offset="100%" stopColor="#8a6f3e" />
            </radialGradient>
          </defs>
          <circle cx="20" cy="20" r="19" fill="url(#logo-glow)" />
          {/* Twin pines silhouette */}
          <g fill="#0a0e0c">
            <path d="M14 11l-3 6h2l-2 4h6l-2-4h2z" />
            <path d="M26 14l-2.5 5h1.5l-1.5 3h5l-1.5-3h1.5z" />
            <rect x="13.4" y="20.5" width="1.2" height="3" rx="0.4" />
            <rect x="25.4" y="22" width="1" height="2.4" rx="0.3" />
            <path d="M5 26h30v1.4H5z" opacity="0.35" />
          </g>
        </svg>
      </span>
      <span className="logo-name">Forest <span>Retreat</span></span>
    </Link>
  );
}
