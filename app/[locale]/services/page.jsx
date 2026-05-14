import ServicesPage from '../../../components/ServicesPage';
import { DICT, pick } from '../../../lib/dict.js';

const LOCALES = ['ru', 'lv', 'en'];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const title = pick(DICT.services.titleA, locale) + ' ' + pick(DICT.services.titleAccent, locale);
  const description = pick(DICT.services.sub, locale);
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/services`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/services`])),
    },
    openGraph: { title, description, url: `/${locale}/services` },
  };
}

export default function Page() {
  return <ServicesPage />;
}
