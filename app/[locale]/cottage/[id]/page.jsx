import { notFound } from 'next/navigation';
import CottageDetail from '../../../../components/CottageDetail';
import { COTTAGES, findCottage, photoUrl } from '../../../../lib/data';
import { pick } from '../../../../lib/dict.js';

const LOCALES = ['ru', 'lv', 'en'];
const SITE = 'https://forest-retreat-xi.vercel.app';

export function generateStaticParams() {
  // 4 cottages × 3 locales = 12 prerendered pages
  return LOCALES.flatMap((locale) =>
    COTTAGES.map((c) => ({ locale, id: c.id }))
  );
}

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const c = findCottage(id);
  if (!c) return {};
  const name = pick(c.name, locale);
  const desc = pick(c.shortDescription, locale);
  const image = `${SITE}${photoUrl(c, c.photos[0])}`;
  return {
    title: name,
    description: desc,
    alternates: {
      canonical: `/${locale}/cottage/${id}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/cottage/${id}`])),
    },
    openGraph: {
      title: name,
      description: desc,
      url: `${SITE}/${locale}/cottage/${id}`,
      images: [{ url: image, width: 1200, height: 800, alt: name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: desc,
      images: [image],
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  if (!findCottage(id)) notFound();
  return <CottageDetail />;
}
