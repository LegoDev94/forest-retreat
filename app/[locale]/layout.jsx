import { notFound } from 'next/navigation';
import { LocaleProvider } from '../../lib/i18n.jsx';
import Aurora from '../../components/Aurora';
import CursorGlow from '../../components/CursorGlow';
import ScrollProgress from '../../components/ScrollProgress';
import SmoothScroll from '../../components/SmoothScroll';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

const LOCALES = ['ru', 'lv', 'en'];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!LOCALES.includes(locale)) return {};
  const og = '/content/deer-park/photo/29157100.jpg';
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ru: '/ru',
        lv: '/lv',
        en: '/en',
        'x-default': '/ru',
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Forest Retreat',
      locale: { ru: 'ru_RU', lv: 'lv_LV', en: 'en_US' }[locale],
      images: [{ url: og, width: 1200, height: 800, alt: 'Forest Retreat Deer Park' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [og],
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!LOCALES.includes(locale)) notFound();

  return (
    <LocaleProvider locale={locale}>
      <div className="bg-atmosphere" />
      <div className="bg-grain" />
      <Aurora />
      <CursorGlow />
      <ScrollProgress />
      <SmoothScroll />
      <Nav />
      {children}
      <Footer />
    </LocaleProvider>
  );
}
