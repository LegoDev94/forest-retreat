import { COTTAGES } from '../lib/data';

const SITE = 'https://www.forestretreat.lv';
const LOCALES = ['ru', 'lv', 'en'];
const LEGAL_DOCS = ['terms', 'privacy', 'refund'];

// Build hreflang alternates object for a given path-template (uses %s for locale).
// Returns object compatible with Next.js Metadata sitemap alternates.languages.
function alternates(pathTemplate) {
  const languages = {};
  for (const l of LOCALES) languages[l] = `${SITE}${pathTemplate.replace('%s', l)}`;
  languages['x-default'] = `${SITE}${pathTemplate.replace('%s', 'ru')}`;
  return languages;
}

export default function sitemap() {
  const now = new Date();
  const entries = [];

  // Home (per-locale)
  for (const l of LOCALES) {
    entries.push({
      url:        `${SITE}/${l}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority:   1.0,
      alternates: { languages: alternates('/%s') },
    });
  }

  // Cottages (12 entries: 4 × 3 locales)
  for (const c of COTTAGES) {
    for (const l of LOCALES) {
      entries.push({
        url:        `${SITE}/${l}/cottage/${c.id}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority:   0.9,
        alternates: { languages: alternates(`/%s/cottage/${c.id}`) },
      });
    }
  }

  // Services (3 locales) — added 2026-05; deer-park ticket, picnic, tent, jacuzzi, sauna
  for (const l of LOCALES) {
    entries.push({
      url:        `${SITE}/${l}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority:   0.8,
      alternates: { languages: alternates('/%s/services') },
    });
  }

  // Legal pages (9 entries: 3 docs × 3 locales)
  for (const doc of LEGAL_DOCS) {
    for (const l of LOCALES) {
      entries.push({
        url:        `${SITE}/${l}/legal/${doc}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority:   0.3,
        alternates: { languages: alternates(`/%s/legal/${doc}`) },
      });
    }
  }

  return entries;
}
