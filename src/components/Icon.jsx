// Icon — single line-icon component with curated set in Lucide style
// Stroke 1.5, rounded caps, currentColor — paired with the brand's gold/forest palette

const ICONS = {
  // Nature & cottage
  tree: (
    <>
      <path d="M12 2L8 8h2l-3 4h2l-3 5h12l-3-5h2l-3-4h2z" />
      <line x1="12" y1="17" x2="12" y2="22" />
    </>
  ),
  leaf: (
    <path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zm0 0v-7" />
  ),
  mountain: (
    <path d="M3 20l5-9 4 6 3-3 6 6H3z" />
  ),
  fire: (
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
  ),
  // Amenities
  hottub: (
    <>
      <path d="M3 12h18l-1 8H4l-1-8z" />
      <path d="M7 12V8a2 2 0 014 0" />
      <path d="M14 12V6" />
      <circle cx="14" cy="4" r="1.5" />
      <path d="M11 16c1 0 1-1 2-1s1 1 2 1 1-1 2-1 1 1 2 1" />
    </>
  ),
  sauna: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M7 10c1 1 1 2 0 3M11 10c1 1 1 2 0 3M15 10c1 1 1 2 0 3" />
    </>
  ),
  film: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="6" y1="2" x2="6" y2="22" />
      <line x1="18" y1="2" x2="18" y2="22" />
      <line x1="2" y1="9" x2="6" y2="9" />
      <line x1="2" y1="15" x2="6" y2="15" />
      <line x1="18" y1="9" x2="22" y2="9" />
      <line x1="18" y1="15" x2="22" y2="15" />
    </>
  ),
  paw: (
    <>
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="16" r="2" />
      <circle cx="4" cy="8" r="2" />
      <circle cx="6" cy="16" r="2" />
      <path d="M8 22a4 4 0 008 0c0-3-2-4-4-4s-4 1-4 4z" />
    </>
  ),
  fish: (
    <>
      <path d="M3 12s2-5 8-5 9 5 9 5-3 5-9 5-8-5-8-5z" />
      <circle cx="16" cy="12" r="0.8" fill="currentColor" />
      <path d="M3 12c-1-1-1.5-2-1.5-3M3 12c-1 1-1.5 2-1.5 3" />
    </>
  ),
  bike: (
    <>
      <circle cx="6" cy="17" r="4" />
      <circle cx="18" cy="17" r="4" />
      <path d="M6 17l4-9h4l3 9M9 8h4M14 8l-1 4M9 8l1 5" />
    </>
  ),
  alpaca: (
    <>
      <path d="M8 9c-2 0-3 2-3 4v3h2v3h2v-3h6v3h2v-3h2v-3c0-2-1-4-3-4" />
      <path d="M8 9V6a2 2 0 014 0M16 9V6a2 2 0 00-4 0M16 9c0-2 1-4 2-5" />
      <circle cx="9" cy="11" r="0.5" fill="currentColor" />
      <circle cx="15" cy="11" r="0.5" fill="currentColor" />
    </>
  ),
  // Trust
  check: <polyline points="4 12 10 18 20 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 16 14" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  star: (
    <polygon points="12 2 15 9 22 10 17 15 18 22 12 19 6 22 7 15 2 10 9 9" />
  ),
  phone: (
    <path d="M5 3h4l2 5-3 2a11 11 0 006 6l2-3 5 2v4a2 2 0 01-2 2A18 18 0 013 5a2 2 0 012-2z" />
  ),
  // UI
  arrowRight: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  heart: (
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  ),
  bed: (
    <>
      <path d="M2 17v-7a2 2 0 012-2h12a2 2 0 012 2h2a2 2 0 012 2v5" />
      <line x1="2" y1="17" x2="22" y2="17" />
      <line x1="2" y1="20" x2="2" y2="14" />
      <line x1="22" y1="20" x2="22" y2="14" />
      <circle cx="7" cy="13" r="2" />
    </>
  ),
  wifi: (
    <>
      <path d="M5 12.5a10 10 0 0114 0" />
      <path d="M8 16a6 6 0 018 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 010 6H9" />
    </>
  ),
  kitchen: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <line x1="4" y1="11" x2="20" y2="11" />
      <circle cx="8" cy="7" r="0.5" fill="currentColor" />
      <circle cx="12" cy="7" r="0.5" fill="currentColor" />
      <circle cx="16" cy="7" r="0.5" fill="currentColor" />
    </>
  ),
  ac: (
    <>
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
      <line x1="18.4" y1="5.6" x2="5.6" y2="18.4" />
    </>
  ),
  lake: (
    <>
      <path d="M3 14s2-2 5-2 5 2 8 2 5-2 5-2" />
      <path d="M3 18s2-2 5-2 5 2 8 2 5-2 5-2" />
      <circle cx="17" cy="6" r="3" />
    </>
  ),
  flame: (
    <path d="M12 2c2 4 6 6 6 11a6 6 0 11-12 0c0-3 2-4 3-6 1.5 1 2 3 3-5z" />
  ),
  transfer: (
    <>
      <rect x="3" y="6" width="14" height="11" rx="2" />
      <line x1="17" y1="9" x2="22" y2="9" />
      <line x1="17" y1="15" x2="22" y2="15" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
    </>
  ),
  family: (
    <>
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="9" r="2" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <path d="M15 13h2a4 4 0 014 4v2" />
    </>
  ),
  balcony: (
    <>
      <path d="M4 10h16M4 21h16M4 21V10M20 21V10M9 21V14M15 21V14" />
      <path d="M6 10V6a6 6 0 0112 0v4" />
    </>
  ),
  darts: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </>
  ),
  sofa: (
    <>
      <path d="M2 12v4a2 2 0 002 2h16a2 2 0 002-2v-4" />
      <path d="M4 12V8a2 2 0 012-2h12a2 2 0 012 2v4" />
      <path d="M2 12c1-1 2-1 2 0M22 12c-1-1-2-1-2 0" />
      <line x1="4" y1="18" x2="4" y2="20" />
      <line x1="20" y1="18" x2="20" y2="20" />
    </>
  ),
  rabbit: (
    <>
      <path d="M9 4c-1 0-2 2-2 5M15 4c1 0 2 2 2 5" />
      <path d="M5 12a7 7 0 0114 0v4a3 3 0 01-3 3H8a3 3 0 01-3-3z" />
      <circle cx="9" cy="14" r="0.5" fill="currentColor" />
      <circle cx="15" cy="14" r="0.5" fill="currentColor" />
    </>
  ),
  // Brand mark — used in logo
  brandMark: (
    <>
      <path d="M12 4l-5 8h3l-3 5h10l-3-5h3z" fill="currentColor" stroke="none" />
      <line x1="12" y1="17" x2="12" y2="20" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
};

export default function Icon({ name, size = 24, stroke = 1.6, className = '', ...rest }) {
  const path = ICONS[name];
  if (!path) return null;
  return (
    <svg
      className={`icon icon-${name} ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {path}
    </svg>
  );
}
