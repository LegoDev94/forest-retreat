import { notFound } from 'next/navigation';
import { LEGAL, LEGAL_KEYS, COMPANY } from '../../../../lib/legal';
import { pick } from '../../../../lib/dict';

const LOCALES = ['ru', 'lv', 'en'];

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    LEGAL_KEYS.map((doc) => ({ locale, doc })),
  );
}

export async function generateMetadata({ params }) {
  const { locale, doc } = await params;
  if (!LOCALES.includes(locale) || !LEGAL[doc]) return {};
  return {
    title: `${pick(LEGAL[doc].title, locale)} — Forest Retreat`,
    robots: { index: true, follow: true },
  };
}

export default async function LegalPage({ params }) {
  const { locale, doc } = await params;
  if (!LOCALES.includes(locale) || !LEGAL[doc]) notFound();
  const data = LEGAL[doc];

  return (
    <main className="legal-page">
      <article className="legal-article">
        <h1>{pick(data.title, locale)}</h1>
        <p className="legal-updated">{pick(data.updated, locale)}</p>

        {data.sections.map((s, i) => (
          <section key={i} className="legal-section">
            <h2>{pick(s.h, locale)}</h2>
            <p>{pick(s.p, locale)}</p>
          </section>
        ))}

        <footer className="legal-footer">
          <p>
            <strong>{COMPANY.name}</strong><br />
            {COMPANY.address}<br />
            {COMPANY.phone} · {COMPANY.email}
          </p>
        </footer>
      </article>
    </main>
  );
}
